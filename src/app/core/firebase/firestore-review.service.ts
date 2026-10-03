/**
 * Firestore Review Service
 *
 * Manages customer reviews of legal professionals.
 *
 * Business Rules enforced:
 * 1. Review only allowed after booking COMPLETED
 * 2. One review per booking (duplicate prevention)
 * 3. Customer can only review their own completed bookings
 * 4. Professional cannot modify customer reviews
 * 5. Admin can moderate (change status to FLAGGED/HIDDEN)
 *
 * Security Rules enforce rules 3-5 at server level.
 */

import { Injectable, inject, signal, computed } from '@angular/core';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from './firebase.app';
import { FirestoreReview, COLLECTIONS } from './firestore.types';
import { CustomerReview } from '../services/customer-review.service';
import { mapFirebaseError } from './firebase-error.handler';
import { AuthStateService } from '../services/auth-state.service';

@Injectable({ providedIn: 'root' })
export class FirestoreReviewService {
  private readonly db = inject(FIREBASE_FIRESTORE);
  private readonly authState = inject(AuthStateService);

  private readonly _customerReviews = signal<CustomerReview[]>([]);
  private readonly _professionalReviews = signal<CustomerReview[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _submitting = signal(false);

  public readonly customerReviews = this._customerReviews.asReadonly();
  public readonly professionalReviews = this._professionalReviews.asReadonly();
  public readonly isLoading = this._loading.asReadonly();
  public readonly isSubmitting = this._submitting.asReadonly();
  public readonly error = this._error.asReadonly();

  /**
   * Load reviews written by the authenticated customer.
   */
  public async loadCustomerReviews(customerId: string): Promise<void> {
    this._loading.set(true);
    try {
      const q = query(
        collection(this.db, COLLECTIONS.REVIEWS),
        where('customerId', '==', customerId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const reviews = snap.docs.map(d => this.mapReview(d.id, d.data() as FirestoreReview));
      this._customerReviews.set(reviews);
    } catch (err) {
      const mapped = mapFirebaseError(err);
      this._error.set(mapped.userMessage);
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Load reviews for a specific professional (public + PUBLISHED only).
   */
  public async loadProfessionalReviews(professionalId: string): Promise<void> {
    this._loading.set(true);
    try {
      const q = query(
        collection(this.db, COLLECTIONS.REVIEWS),
        where('professionalId', '==', professionalId),
        where('status', '==', 'PUBLISHED'),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const reviews = snap.docs.map(d => this.mapReview(d.id, d.data() as FirestoreReview));
      this._professionalReviews.set(reviews);
    } catch (err) {
      console.error('[ReviewService] loadProfessionalReviews:', err);
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Submit a new review.
   * Validates:
   * - User is authenticated
   * - bookingId is provided (booking must be COMPLETED — validated in Security Rules)
   * - customerId is set from auth UID (not form input)
   * - No duplicate review for same booking
   */
  public async submitReview(
    bookingId: string,
    professionalId: string,
    professionalName: string,
    serviceTitle: string,
    rating: number,
    comment: string
  ): Promise<boolean> {
    const user = this.authState.currentUser();
    if (!user) {
      this._error.set('Anda harus login untuk memberikan ulasan.');
      return false;
    }

    // Check for duplicate review
    const existing = this._customerReviews().find(r => r.bookingId === bookingId);
    if (existing) {
      this._error.set('Anda sudah memberikan ulasan untuk konsultasi ini.');
      return false;
    }

    this._submitting.set(true);
    this._error.set(null);

    try {
      const review: Omit<FirestoreReview, never> = {
        bookingId,
        customerId: user.id,       // Always from auth UID
        professionalId,
        customerName: user.fullName,
        professionalName,
        serviceTitle,
        rating,
        comment,
        status: 'PUBLISHED',       // Default published; Admin can flag/hide
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      };

      const ref = await addDoc(collection(this.db, COLLECTIONS.REVIEWS), review);

      // Optimistic update
      this._customerReviews.update(reviews => [
        {
          id: ref.id,
          bookingId,
          customerId: user.id,
          customerName: user.fullName,
          professionalId,
          professionalName,
          serviceTitle,
          rating,
          comment,
          createdAt: new Date().toLocaleDateString('id-ID'),
          isSubmitted: true,
        },
        ...reviews,
      ]);

      return true;
    } catch (err) {
      const mapped = mapFirebaseError(err);
      this._error.set(mapped.userMessage);
      return false;
    } finally {
      this._submitting.set(false);
    }
  }

  /**
   * Professional adds a reply to a review.
   * Only the review's professionalId can reply.
   */
  public async replyToReview(reviewId: string, replyText: string): Promise<boolean> {
    try {
      await updateDoc(doc(this.db, COLLECTIONS.REVIEWS, reviewId), {
        replyText,
        repliedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (err) {
      const mapped = mapFirebaseError(err);
      this._error.set(mapped.userMessage);
      return false;
    }
  }

  private mapReview(id: string, data: FirestoreReview): CustomerReview {
    return {
      id,
      bookingId: data.bookingId,
      customerId: data.customerId,
      customerName: data.customerName,
      professionalId: data.professionalId,
      professionalName: data.professionalName,
      serviceTitle: data.serviceTitle,
      rating: data.rating,
      comment: data.comment,
      createdAt: data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : '',
      isSubmitted: true,
    };
  }
}
