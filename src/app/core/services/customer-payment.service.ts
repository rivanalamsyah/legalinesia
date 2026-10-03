import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthStateService } from './auth-state.service';

export interface PaymentTransaction {
  id: string; // e.g. "TRX-202610-001"
  bookingId: string;
  customerId: string;
  serviceTitle: string;
  professionalName: string;
  amount: number;
  paymentMethod: string; // e.g. "Bank Transfer BCA (Virtual Account)"
  virtualAccountNumber: string;
  status: 'WAITING_PAYMENT' | 'VERIFYING' | 'PAID' | 'FAILED';
  createdAt: string;
  verifiedAt?: string;
}

export const MOCK_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'TRX-202610-001',
    bookingId: 'BK-202610-001',
    customerId: 'cust-demo-101',
    serviceTitle: 'Pendirian PT & Pengurusan NIB OSS RBA',
    professionalName: 'Bambang Sutrisno, S.H., M.H.',
    amount: 350000,
    paymentMethod: 'Transfer Bank BCA Virtual Account',
    virtualAccountNumber: '88001234567890',
    status: 'PAID',
    createdAt: '2026-10-01 11:30 WIB',
    verifiedAt: '2026-10-02 09:00 WIB'
  },
  {
    id: 'TRX-202609-044',
    bookingId: 'BK-202609-044',
    customerId: 'cust-demo-101',
    serviceTitle: 'Review & Drafting Perjanjian Kerjasama',
    professionalName: 'Dr. Anisa Rahmawati, S.H., M.Kn.',
    amount: 300000,
    paymentMethod: 'Kartu Kredit (Visa/Mastercard)',
    virtualAccountNumber: '**** **** **** 4829',
    status: 'PAID',
    createdAt: '2026-09-20 08:30 WIB',
    verifiedAt: '2026-09-20 08:31 WIB'
  },
  {
    id: 'TRX-202610-089',
    bookingId: 'BK-202610-089',
    customerId: 'cust-demo-101',
    serviceTitle: 'Pendaftaran Merek & Hak Cipta (HKI)',
    professionalName: 'Hendra Wijaya, S.H., LL.M.',
    amount: 400000,
    paymentMethod: 'Transfer Mandiri Virtual Account',
    virtualAccountNumber: '88709988776655',
    status: 'WAITING_PAYMENT',
    createdAt: '2026-10-03 07:30 WIB'
  }
];

@Injectable({
  providedIn: 'root'
})
export class CustomerPaymentService {
  private readonly authState = inject(AuthStateService);
  private readonly paymentsSignal = signal<PaymentTransaction[]>(MOCK_PAYMENTS);

  public readonly customerPayments = computed(() => {
    const user = this.authState.currentUser();
    if (!user) return [];
    if (user.role === 'ADMIN') return this.paymentsSignal();
    return this.paymentsSignal().filter(p => p.customerId === user.id || user.id === 'cust-demo-101');
  });

  public readonly pendingPayments = computed(() => {
    return this.customerPayments().filter(p => p.status === 'WAITING_PAYMENT' || p.status === 'VERIFYING');
  });

  public confirmManualPayment(transactionId: string): Observable<boolean> {
    const list = [...this.paymentsSignal()];
    const idx = list.findIndex(p => p.id === transactionId);
    if (idx === -1) return of(false);

    list[idx] = {
      ...list[idx],
      status: 'VERIFYING',
      verifiedAt: 'Dalam Verifikasi Manual Admin'
    };
    this.paymentsSignal.set(list);

    // Simulate verification delay
    setTimeout(() => {
      const currentList = [...this.paymentsSignal()];
      const itemIndex = currentList.findIndex(p => p.id === transactionId);
      if (itemIndex !== -1) {
        currentList[itemIndex] = {
          ...currentList[itemIndex],
          status: 'PAID',
          verifiedAt: new Date().toLocaleString('id-ID')
        };
        this.paymentsSignal.set(currentList);
      }
    }, 1200);

    return of(true);
  }
}
