/**
 * Firestore Booking Service
 *
 * Domain service for booking operations. Enforces:
 * - Customer ownership (customerId = current user UID)
 * - Professional ownership (professionalId = current user UID)
 * - State machine transitions (canTransitionBooking)
 * - No arbitrary status mutations
 *
 * All Firestore queries are indexed (see firestore.indexes.json).
 * Security enforcement is at Firestore Rules level (server-side).
 */

import { Injectable, inject, signal } from '@angular/core';
import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  Unsubscribe
} from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from './firebase.app';
import {
  FirestoreBooking,
  FirestoreBookingTimelineEvent,
  FirestoreBookingStatus,
  COLLECTIONS
} from './firestore.types';
import { BookingItem, BookingStatus, canTransitionBooking } from '../models/booking.model';
import { AuthStateService } from '../services/auth-state.service';
import { mapFirebaseError } from './firebase-error.handler';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly db = inject(FIREBASE_FIRESTORE);
  private readonly authState = inject(AuthStateService);

  private readonly _customerBookings = signal<BookingItem[]>([]);
  private readonly _proBookings = signal<BookingItem[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private _unsubscribeCustomer?: Unsubscribe;
  private _unsubscribePro?: Unsubscribe;

  // Public readonly signals
  public readonly customerBookings = this._customerBookings.asReadonly();
  public readonly proBookings = this._proBookings.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  /**
   * Subscribe to customer bookings (real-time).
   * Enforces customer ownership: query where('customerId', '==', auth.uid).
   */
  public subscribeCustomerBookings(): Unsubscribe | null {
    const uid = this.authState.currentUser()?.id;
    if (!uid) {
      this._customerBookings.set([]);
      return null;
    }

    this._loading.set(true);
    if (this._unsubscribeCustomer) {
      this._unsubscribeCustomer();
    }

    const q = query(
      collection(this.db, COLLECTIONS.BOOKINGS),
      where('customerId', '==', uid),
      orderBy('createdAt', 'desc')
    );

    this._unsubscribeCustomer = onSnapshot(
      q,
      (snapshot) => {
        const bookings: BookingItem[] = snapshot.docs.map(docSnap =>
          this.mapBookingDoc(docSnap.id, docSnap.data() as FirestoreBooking)
        );
        this._customerBookings.set(bookings);
        this._loading.set(false);
        this._error.set(null);
      },
      (err) => {
        const mapped = mapFirebaseError(err);
        this._error.set(mapped.userMessage);
        this._loading.set(false);
      }
    );

    return this._unsubscribeCustomer;
  }

  /**
   * Subscribe to legal professional bookings (real-time).
   * Enforces professional ownership: query where('professionalId', '==', auth.uid).
   */
  public subscribeProfessionalBookings(): Unsubscribe | null {
    const uid = this.authState.currentUser()?.id;
    if (!uid) {
      this._proBookings.set([]);
      return null;
    }

    this._loading.set(true);
    if (this._unsubscribePro) {
      this._unsubscribePro();
    }

    const q = query(
      collection(this.db, COLLECTIONS.BOOKINGS),
      where('professionalId', '==', uid),
      orderBy('createdAt', 'desc')
    );

    this._unsubscribePro = onSnapshot(
      q,
      (snapshot) => {
        const bookings: BookingItem[] = snapshot.docs.map(docSnap =>
          this.mapBookingDoc(docSnap.id, docSnap.data() as FirestoreBooking)
        );
        this._proBookings.set(bookings);
        this._loading.set(false);
        this._error.set(null);
      },
      (err) => {
        const mapped = mapFirebaseError(err);
        this._error.set(mapped.userMessage);
        this._loading.set(false);
      }
    );

    return this._unsubscribePro;
  }

  /**
   * Create a new booking.
   * customerId is always set from authenticated UID — never from form input.
   */
  public async createBooking(
    booking: Omit<FirestoreBooking, 'createdAt' | 'updatedAt' | 'timeline' | 'status' | 'paymentStatus' | 'customerId'>
  ): Promise<{ id: string } | null> {
    const uid = this.authState.currentUser()?.id;
    if (!uid) {
      this._error.set('Anda harus login untuk membuat booking.');
      return null;
    }

    const initialTimeline: FirestoreBookingTimelineEvent = {
      status: 'REQUESTED',
      label: 'Booking diajukan oleh Klien',
      timestamp: serverTimestamp() as Timestamp,
      actorId: uid
    };

    const newBooking = {
      ...booking,
      customerId: uid, // ALWAYS forced to current user UID
      status: 'REQUESTED' as FirestoreBookingStatus,
      paymentStatus: 'UNPAID' as const,
      timeline: [initialTimeline],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      const docRef = await addDoc(collection(this.db, COLLECTIONS.BOOKINGS), newBooking);
      return { id: docRef.id };
    } catch (err) {
      const mapped = mapFirebaseError(err);
      this._error.set(mapped.userMessage);
      return null;
    }
  }

  /**
   * Transition booking status with state machine validation.
   * Prevents invalid state jumps (e.g. REQUESTED -> COMPLETED directly).
   */
  public async updateBookingStatus(
    bookingId: string,
    targetStatus: BookingStatus,
    note?: string,
    actorId?: string
  ): Promise<boolean> {
    const bookingDocRef = doc(this.db, COLLECTIONS.BOOKINGS, bookingId);
    const docSnap = await getDoc(bookingDocRef);

    if (!docSnap.exists()) {
      this._error.set('Data booking tidak ditemukan.');
      return false;
    }

    const currentBooking = docSnap.data() as FirestoreBooking;

    // Enforce state machine transition validation
    if (!canTransitionBooking(currentBooking.status as BookingStatus, targetStatus)) {
      this._error.set(
        `Perubahan status dari "${currentBooking.status}" ke "${targetStatus}" tidak diperbolehkan.`
      );
      return false;
    }

    const updateData: Record<string, any> = {
      status: targetStatus,
      updatedAt: serverTimestamp(),
    };

    if (targetStatus === 'PAYMENT_VERIFIED' || targetStatus === 'CONFIRMED') {
      updateData['paymentStatus'] = 'PAID';
    }

    try {
      await updateDoc(bookingDocRef, updateData);
      return true;
    } catch (err) {
      const mapped = mapFirebaseError(err);
      this._error.set(mapped.userMessage);
      return false;
    }
  }

  /**
   * Cleanup snapshot listeners.
   */
  public destroy(): void {
    if (this._unsubscribeCustomer) this._unsubscribeCustomer();
    if (this._unsubscribePro) this._unsubscribePro();
  }

  private mapBookingDoc(id: string, data: FirestoreBooking): BookingItem {
    return {
      id,
      customerId: data.customerId,
      customerName: data.customerSnapshot?.fullName ?? 'Klien',
      customerEmail: data.customerSnapshot?.email ?? '',
      customerPhone: data.customerSnapshot?.phoneNumber,
      professionalId: data.professionalId,
      professionalName: data.professionalSnapshot?.fullName ?? 'Konsultan Hukum',
      professionalTitle: data.professionalSnapshot?.title ?? 'Advokat',
      professionalAvatar: data.professionalSnapshot?.avatarUrl,
      barLicenseNumber: data.professionalSnapshot?.barLicenseNumber,
      serviceId: data.serviceId,
      serviceTitle: data.serviceSnapshot?.title ?? 'Layanan Hukum',
      practiceArea: data.serviceSnapshot?.practiceAreaName ?? 'Hukum Umum',
      appointmentType: data.serviceSnapshot?.appointmentType ?? 'ONLINE_VIDEO',
      selectedDate: data.selectedDate,
      selectedTimeSlot: data.selectedTimeSlot,
      consultationFee: data.serviceSnapshot?.consultationFee ?? 0,
      paymentStatus: data.paymentStatus,
      problemCategory: data.problemCategory,
      problemDescription: data.problemDescription,
      meetingUrl: data.meetingUrl,
      status: data.status as BookingStatus,
      timeline: (data.timeline || []).map(t => ({
        status: t.status as BookingStatus,
        label: t.label,
        timestamp: t.timestamp instanceof Timestamp
          ? t.timestamp.toDate().toLocaleDateString('id-ID')
          : new Date().toLocaleDateString('id-ID'),
        note: t.note
      })),
      createdAt: data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : new Date().toISOString(),
      updatedAt: data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate().toISOString()
        : new Date().toISOString(),
      cancellationReason: data.cancellationReason
    };
  }
}
