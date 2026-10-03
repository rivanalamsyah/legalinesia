export type AppointmentType = 'ONLINE_VIDEO' | 'IN_PERSON' | 'DOCUMENT_REVIEW';

export type BookingStatus =
  | 'REQUESTED'
  | 'UNDER_REVIEW'
  | 'WAITING_PAYMENT'
  | 'PAYMENT_VERIFIED'
  | 'CONFIRMED'
  | 'IN_SESSION'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'RESCHEDULE_REQUESTED';

export interface BookingTimelineEvent {
  status: BookingStatus;
  label: string;
  timestamp: string;
  note?: string;
}

export interface BookingItem {
  id: string; // e.g. "BK-202610-001"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  professionalId: string;
  professionalName: string;
  professionalTitle: string;
  professionalAvatar?: string;
  barLicenseNumber?: string;

  serviceId: string;
  serviceTitle: string;
  practiceArea: string;
  appointmentType: AppointmentType;

  selectedDate: string; // "YYYY-MM-DD"
  selectedTimeSlot: string; // e.g. "14:00 - 15:00 WIB"
  consultationFee: number;
  paymentStatus: 'UNPAID' | 'WAITING_VERIFICATION' | 'PAID' | 'REFUNDED';
  paymentMethod?: string;

  problemCategory: string;
  problemDescription: string;
  documentAttachments?: string[];

  meetingUrl?: string;
  status: BookingStatus;
  timeline: BookingTimelineEvent[];

  createdAt: string;
  updatedAt: string;
  cancellationReason?: string;
}

export interface BookingDraft {
  serviceId?: string;
  serviceTitle?: string;
  professionalId?: string;
  professionalName?: string;
  professionalAvatar?: string;
  consultationFee?: number;
  appointmentType: AppointmentType;
  selectedDate?: string;
  selectedTimeSlot?: string;
  caseCategory?: string;
  caseSummary?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  agreedToTerms?: boolean;
}

export interface BookingStep {
  stepIndex: number;
  label: string;
  isCompleted: boolean;
  isValid: boolean;
}

// State Machine valid transitions map
export const VALID_BOOKING_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  REQUESTED: ['UNDER_REVIEW', 'CANCELLED', 'REJECTED'],
  UNDER_REVIEW: ['WAITING_PAYMENT', 'REJECTED', 'CANCELLED'],
  WAITING_PAYMENT: ['PAYMENT_VERIFIED', 'CANCELLED'],
  PAYMENT_VERIFIED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_SESSION', 'RESCHEDULE_REQUESTED', 'CANCELLED'],
  IN_SESSION: ['COMPLETED'],
  COMPLETED: [],
  REJECTED: [],
  CANCELLED: [],
  RESCHEDULE_REQUESTED: ['CONFIRMED', 'CANCELLED']
};

export function canTransitionBooking(current: BookingStatus, target: BookingStatus): boolean {
  return VALID_BOOKING_TRANSITIONS[current]?.includes(target) ?? false;
}
