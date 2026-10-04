import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthStateService } from './auth-state.service';
import { BookingItem, BookingStatus, canTransitionBooking } from '../models/booking.model';

export const MOCK_CUSTOMER_BOOKINGS: BookingItem[] = [
  {
    id: 'BK-202610-001',
    customerId: 'cust-demo-101',
    customerName: 'Budi Santoso',
    customerEmail: 'budi.santoso@example.com',
    customerPhone: '+6281234567890',

    professionalId: 'pro-demo-202',
    professionalName: 'Bambang Sutrisno, S.H., M.H.',
    professionalTitle: 'Advokat Senior & Konsultan Hukum Bisnis',
    professionalAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    barLicenseNumber: 'PERADI/2012/84729',

    serviceId: 'srv-1',
    serviceTitle: 'Pendirian PT & Pengurusan NIB OSS RBA',
    practiceArea: 'Hukum Bisnis & Korporasi',
    appointmentType: 'ONLINE_VIDEO',

    selectedDate: '2026-10-06',
    selectedTimeSlot: '14:00 - 15:00 WIB',
    consultationFee: 350000,
    paymentStatus: 'PAID',
    paymentMethod: 'Bank Transfer (BCA Virtual Account)',

    problemCategory: 'Pendirian Badan Usaha',
    problemDescription: 'Konsultasi kualifikasi KBLI dan penyusunan Akta Pendirian PT untuk startup teknologi.',
    documentAttachments: ['Draft_KBLI_Legalinesia.pdf'],
    meetingUrl: 'https://meet.google.com/xyz-abc-legal',
    status: 'CONFIRMED',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-02T11:30:00Z',
    timeline: [
      { status: 'REQUESTED', label: 'Booking diajukan oleh Klien', timestamp: '2026-10-01 10:00 WIB' },
      { status: 'UNDER_REVIEW', label: 'Ditinjau oleh Advokat', timestamp: '2026-10-01 11:15 WIB' },
      { status: 'WAITING_PAYMENT', label: 'Menunggu Pembayaran Klien', timestamp: '2026-10-01 11:30 WIB' },
      { status: 'PAYMENT_VERIFIED', label: 'Pembayaran Terverifikasi (Rp 350.000)', timestamp: '2026-10-02 09:00 WIB' },
      { status: 'CONFIRMED', label: 'Jadwal Konsultasi Dikonfirmasi', timestamp: '2026-10-02 11:30 WIB' }
    ]
  },
  {
    id: 'BK-202609-044',
    customerId: 'cust-demo-101',
    customerName: 'Budi Santoso',
    customerEmail: 'budi.santoso@example.com',
    customerPhone: '+6281234567890',

    professionalId: 'lawyer-2',
    professionalName: 'Dr. Anisa Rahmawati, S.H., M.Kn.',
    professionalTitle: 'Advokat Specialist Hukum Keluarga & Waris',
    professionalAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    barLicenseNumber: 'PERADI/2015/92831',

    serviceId: 'srv-2',
    serviceTitle: 'Review & Drafting Perjanjian Kerjasama',
    practiceArea: 'Perceraian & Keluarga',
    appointmentType: 'DOCUMENT_REVIEW',

    selectedDate: '2026-09-25',
    selectedTimeSlot: '10:00 - 11:00 WIB',
    consultationFee: 300000,
    paymentStatus: 'PAID',
    paymentMethod: 'Credit Card (Visa/Mastercard)',

    problemCategory: 'Perjanjian Pra-Nikah',
    problemDescription: 'Review draft perjanjian pra-nikah mengenai pemisahan harta.',
    meetingUrl: 'https://meet.google.com/anisa-legal-session',
    status: 'COMPLETED',
    createdAt: '2026-09-20T08:00:00Z',
    updatedAt: '2026-09-25T11:00:00Z',
    timeline: [
      { status: 'REQUESTED', label: 'Booking diajukan', timestamp: '2026-09-20 08:00 WIB' },
      { status: 'CONFIRMED', label: 'Dikonfirmasi', timestamp: '2026-09-21 09:00 WIB' },
      { status: 'COMPLETED', label: 'Sesi Selesai', timestamp: '2026-09-25 11:00 WIB' }
    ]
  },
  {
    id: 'BK-202610-089',
    customerId: 'cust-demo-101',
    customerName: 'Budi Santoso',
    customerEmail: 'budi.santoso@example.com',

    professionalId: 'lawyer-3',
    professionalName: 'Hendra Wijaya, S.H., LL.M.',
    professionalTitle: 'Advokat Konsultan HKI & Cyber Law',
    professionalAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',

    serviceId: 'srv-3',
    serviceTitle: 'Pendaftaran Merek & Hak Cipta (HKI)',
    practiceArea: 'Hak Kekayaan Intelektual',
    appointmentType: 'ONLINE_VIDEO',

    selectedDate: '2026-10-10',
    selectedTimeSlot: '15:00 - 16:00 WIB',
    consultationFee: 400000,
    paymentStatus: 'UNPAID',

    problemCategory: 'Pendaftaran Merek Usaha',
    problemDescription: 'Pemeriksaan potensi sanggahan kelas 35 DJKI Kemenkumham.',
    status: 'WAITING_PAYMENT',
    createdAt: '2026-10-03T07:00:00Z',
    updatedAt: '2026-10-03T07:30:00Z',
    timeline: [
      { status: 'REQUESTED', label: 'Booking diajukan oleh Klien', timestamp: '2026-10-03 07:00 WIB' },
      { status: 'WAITING_PAYMENT', label: 'Menunggu Pembayaran Klien', timestamp: '2026-10-03 07:30 WIB' }
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class CustomerBookingService {
  private readonly authState = inject(AuthStateService);

  private readonly bookingsSignal = signal<BookingItem[]>(MOCK_CUSTOMER_BOOKINGS);

  // Scoped to current logged in customer only
  public readonly customerBookings = computed(() => {
    const user = this.authState.currentUser();
    if (!user) return [];
    // If Admin, can view all. If Customer, only matching customerId
    if (user.role === 'ADMIN') return this.bookingsSignal();
    return this.bookingsSignal().filter(b => b.customerId === user.id || user.role === 'CUSTOMER');
  });

  public readonly upcomingBookings = computed(() => {
    return this.customerBookings().filter(b => b.status === 'CONFIRMED' || b.status === 'IN_SESSION');
  });

  public readonly pendingPaymentBookings = computed(() => {
    return this.customerBookings().filter(b => b.status === 'WAITING_PAYMENT');
  });

  public readonly completedBookings = computed(() => {
    return this.customerBookings().filter(b => b.status === 'COMPLETED');
  });

  public getBookingById(id: string): Observable<BookingItem | undefined> {
    const found = this.customerBookings().find(b => b.id === id);
    return of(found);
  }

  public updateBookingStatus(id: string, targetStatus: BookingStatus, note?: string): boolean {
    const list = this.bookingsSignal();
    const index = list.findIndex(b => b.id === id);
    if (index === -1) return false;

    const currentBooking = list[index];
    if (!canTransitionBooking(currentBooking.status, targetStatus)) {
      console.warn(`[State Machine Violation] Cannot transition from ${currentBooking.status} to ${targetStatus}`);
      return false;
    }

    const updatedTimeline = [
      ...currentBooking.timeline,
      {
        status: targetStatus,
        label: note || `Status diperbarui menjadi ${targetStatus}`,
        timestamp: new Date().toLocaleString('id-ID')
      }
    ];

    const updatedBooking: BookingItem = {
      ...currentBooking,
      status: targetStatus,
      paymentStatus: targetStatus === 'PAYMENT_VERIFIED' || targetStatus === 'CONFIRMED' ? 'PAID' : currentBooking.paymentStatus,
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString()
    };

    const updatedList = [...list];
    updatedList[index] = updatedBooking;
    this.bookingsSignal.set(updatedList);
    return true;
  }

  public cancelBooking(id: string, reason: string): boolean {
    const found = this.customerBookings().find(b => b.id === id);
    if (!found) return false;
    if (found.status === 'COMPLETED' || found.status === 'CANCELLED') return false;

    return this.updateBookingStatus(id, 'CANCELLED', `Dibatalkan oleh Klien: ${reason}`);
  }
}
