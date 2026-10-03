import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthStateService } from './auth-state.service';

export interface CustomerNotificationItem {
  id: string;
  customerId: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'PAYMENT' | 'SYSTEM' | 'REVIEW';
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

export const MOCK_NOTIFICATIONS: CustomerNotificationItem[] = [
  {
    id: 'notif-101',
    customerId: 'cust-demo-101',
    title: 'Jadwal Konsultasi Dikonfirmasi (#BK-202610-001)',
    message: 'Advokat Bambang Sutrisno menyetujui sesi video call pada Senin, 6 Okt 2026 jam 14:00 WIB.',
    type: 'BOOKING',
    isRead: false,
    createdAt: '2 Hari lalu',
    linkUrl: '/portal/customer/bookings/BK-202610-001'
  },
  {
    id: 'notif-102',
    customerId: 'cust-demo-101',
    title: 'Pembayaran Rp 350.000 Terverifikasi',
    message: 'Pembayaran kuitansi via BCA Virtual Account telah berhasil diverifikasi oleh sistem.',
    type: 'PAYMENT',
    isRead: false,
    createdAt: '1 Hari lalu',
    linkUrl: '/portal/customer/payments'
  },
  {
    id: 'notif-103',
    customerId: 'cust-demo-101',
    title: 'Berikan Penilaian Konsultasi Selesai',
    message: 'Sesi konsultasi Anda bersama Dr. Anisa Rahmawati telah selesai. Silakan berikan ulasan.',
    type: 'REVIEW',
    isRead: true,
    createdAt: '3 Hari lalu',
    linkUrl: '/portal/customer/reviews'
  }
];

@Injectable({
  providedIn: 'root'
})
export class CustomerNotificationService {
  private readonly authState = inject(AuthStateService);
  private readonly notificationsSignal = signal<CustomerNotificationItem[]>(MOCK_NOTIFICATIONS);

  public readonly customerNotifications = computed(() => {
    const user = this.authState.currentUser();
    if (!user) return [];
    if (user.role === 'ADMIN') return this.notificationsSignal();
    return this.notificationsSignal().filter(n => n.customerId === user.id || user.id === 'cust-demo-101');
  });

  public readonly unreadCount = computed(() => {
    return this.customerNotifications().filter(n => !n.isRead).length;
  });

  public markAsRead(id: string): void {
    const list = [...this.notificationsSignal()];
    const idx = list.findIndex(n => n.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], isRead: true };
      this.notificationsSignal.set(list);
    }
  }

  public markAllAsRead(): void {
    const list = this.notificationsSignal().map(n => ({ ...n, isRead: true }));
    this.notificationsSignal.set(list);
  }
}
