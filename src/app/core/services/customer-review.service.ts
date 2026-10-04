import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthStateService } from './auth-state.service';
import { CustomerBookingService } from './customer-booking.service';

export interface CustomerReview {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar?: string;
  serviceTitle: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  isSubmitted: boolean;
}

export const MOCK_REVIEWS: CustomerReview[] = [
  {
    id: 'REV-202609-001',
    bookingId: 'BK-202609-044',
    customerId: 'cust-demo-101',
    customerName: 'Budi Santoso',
    professionalId: 'lawyer-2',
    professionalName: 'Dr. Anisa Rahmawati, S.H., M.Kn.',
    professionalAvatar: '/images/avatars/avatar-female-1.png',
    serviceTitle: 'Review & Drafting Perjanjian Kerjasama',
    rating: 5,
    comment: 'Penjelasan Bu Dr. Anisa sangat empatik dan detail mengenai klausul hak asuh anak dan pemisahan harta.',
    createdAt: '2026-09-26 14:00 WIB',
    isSubmitted: true
  }
];

@Injectable({
  providedIn: 'root'
})
export class CustomerReviewService {
  private readonly authState = inject(AuthStateService);
  private readonly bookingService = inject(CustomerBookingService);

  private readonly reviewsSignal = signal<CustomerReview[]>(MOCK_REVIEWS);

  public readonly customerReviews = computed(() => {
    const user = this.authState.currentUser();
    if (!user) return [];
    if (user.role === 'ADMIN') return this.reviewsSignal();
    return this.reviewsSignal().filter(r => r.customerId === user.id || user.role === 'CUSTOMER');
  });

  // Completed bookings that are eligible for review
  public readonly eligibleBookingsForReview = computed(() => {
    const completed = this.bookingService.completedBookings();
    const existingReviewBookingIds = new Set(this.customerReviews().map(r => r.bookingId));
    return completed.filter(b => !existingReviewBookingIds.has(b.id));
  });

  public submitReview(bookingId: string, rating: number, comment: string): Observable<boolean> {
    const user = this.authState.currentUser();
    if (!user) return of(false);

    // Verify booking is completed and not already reviewed
    const booking = this.bookingService.completedBookings().find(b => b.id === bookingId);
    if (!booking) {
      console.warn('[Review Validation Failed] Booking is not completed or does not exist.');
      return of(false);
    }

    const existing = this.customerReviews().find(r => r.bookingId === bookingId);
    if (existing) {
      console.warn('[Review Validation Failed] Review already submitted for this booking.');
      return of(false);
    }

    const newReview: CustomerReview = {
      id: `REV-${Date.now()}`,
      bookingId,
      customerId: user.id,
      customerName: user.fullName,
      professionalId: booking.professionalId,
      professionalName: booking.professionalName,
      professionalAvatar: booking.professionalAvatar,
      serviceTitle: booking.serviceTitle,
      rating,
      comment,
      createdAt: new Date().toLocaleString('id-ID'),
      isSubmitted: true
    };

    this.reviewsSignal.set([newReview, ...this.reviewsSignal()]);
    return of(true);
  }
}
