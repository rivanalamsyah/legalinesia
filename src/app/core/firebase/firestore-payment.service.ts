/**
 * Firestore Payment Service
 *
 * Manages payment records for manual transfer workflow.
 *
 * Payment Architecture (Manual Transfer Flow):
 * 1. Booking created → payment document created with WAITING_PAYMENT
 * 2. Customer transfers to Virtual Account
 * 3. Customer submits confirmation → status VERIFYING
 * 4. Admin verifies payment → status PAID (triggers booking status update to PAYMENT_VERIFIED)
 *
 * Rules:
 * - Customer can ONLY transition WAITING_PAYMENT -> VERIFYING (cannot self-approve to PAID)
 * - Only Admin (role == ADMIN in Rules) can set status to PAID
 * - Payment status is independent from booking status
 */

import { Injectable, inject, signal } from '@angular/core';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FIREBASE_FIRESTORE } from './firebase.app';
import { FirestorePayment, COLLECTIONS } from './firestore.types';
import { AuthStateService } from '../services/auth-state.service';
import { PaymentTransaction } from '../services/customer-payment.service';
import { mapFirebaseError } from './firebase-error.handler';

@Injectable({ providedIn: 'root' })
export class FirestorePaymentService {
  private readonly db = inject(FIREBASE_FIRESTORE);
  private readonly authState = inject(AuthStateService);

  private readonly _payments = signal<PaymentTransaction[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private _unsubscribe?: Unsubscribe;

  public readonly payments = this._payments.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  /**
   * Subscribe to payments for the logged in customer.
   * Scoped by customerId == auth.uid.
   */
  public subscribeCustomerPayments(): Unsubscribe | null {
    const uid = this.authState.currentUser()?.id;
    if (!uid) {
      this._payments.set([]);
      return null;
    }

    this._loading.set(true);
    const q = query(
      collection(this.db, COLLECTIONS.PAYMENTS),
      where('customerId', '==', uid),
      orderBy('createdAt', 'desc')
    );

    this._unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: PaymentTransaction[] = snapshot.docs.map(d =>
          this.mapPayment(d.id, d.data() as FirestorePayment)
        );
        this._payments.set(list);
        this._loading.set(false);
      },
      (err) => {
        const mapped = mapFirebaseError(err);
        this._error.set(mapped.userMessage);
        this._loading.set(false);
      }
    );

    return this._unsubscribe;
  }

  /**
   * Create payment record when booking is placed.
   * Generates reference Virtual Account number.
   */
  public async createPaymentRecord(
    bookingId: string,
    professionalId: string,
    serviceTitle: string,
    professionalName: string,
    amount: number
  ): Promise<string | null> {
    const uid = this.authState.currentUser()?.id;
    if (!uid) {
      this._error.set('Anda harus login untuk memproses pembayaran.');
      return null;
    }

    const vaNumber = this.generateVirtualAccountNumber();

    try {
      const ref = await addDoc(collection(this.db, COLLECTIONS.PAYMENTS), {
        bookingId,
        customerId: uid,
        professionalId,
        serviceTitle,
        professionalName,
        amount,
        paymentMethod: 'Transfer Bank Virtual Account',
        virtualAccountNumber: vaNumber,
        status: 'WAITING_PAYMENT',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return ref.id;
    } catch (err) {
      const mapped = mapFirebaseError(err);
      this._error.set(mapped.userMessage);
      return null;
    }
  }

  /**
   * Customer submits manual payment confirmation.
   * Sets status to VERIFYING — Admin must verify to set PAID.
   * Customer CANNOT set status directly to PAID.
   */
  public confirmManualPayment(transactionId: string): Observable<boolean> {
    return from(
      updateDoc(doc(this.db, COLLECTIONS.PAYMENTS, transactionId), {
        status: 'VERIFYING',
        updatedAt: serverTimestamp(),
      })
    ).pipe(
      map(() => {
        // Optimistic update
        this._payments.update(payments =>
          payments.map(p =>
            p.id === transactionId
              ? { ...p, status: 'VERIFYING' as const }
              : p
          )
        );
        return true;
      }),
      catchError(err => {
        const mapped = mapFirebaseError(err);
        this._error.set(mapped.userMessage);
        return of(false);
      })
    );
  }

  /**
   * Generate a simple Virtual Account number for reference.
   * In production, this should come from a payment provider or Cloud Function.
   */
  private generateVirtualAccountNumber(): string {
    const prefix = '8800';
    const random = Math.floor(Math.random() * 9999999999).toString().padStart(10, '0');
    return `${prefix}${random}`;
  }

  private mapPayment(id: string, data: FirestorePayment): PaymentTransaction {
    return {
      id,
      bookingId: data.bookingId,
      customerId: data.customerId,
      serviceTitle: data.serviceTitle,
      professionalName: data.professionalName,
      amount: data.amount,
      paymentMethod: data.paymentMethod ?? 'Transfer Bank Virtual Account',
      virtualAccountNumber: data.virtualAccountNumber ?? '-',
      status: data.status as PaymentTransaction['status'],
      createdAt: data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })
        : new Date().toLocaleDateString('id-ID'),
      verifiedAt: data.verifiedAt instanceof Timestamp
        ? data.verifiedAt.toDate().toLocaleDateString('id-ID')
        : undefined
    };
  }

  public destroy(): void {
    if (this._unsubscribe) this._unsubscribe();
  }
}
