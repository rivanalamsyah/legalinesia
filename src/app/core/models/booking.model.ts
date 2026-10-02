export type AppointmentType = 'ONLINE_VIDEO' | 'IN_PERSON' | 'DOCUMENT_REVIEW';

export type BookingStatus = 'DRAFT' | 'PENDING_PAYMENT' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

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
