export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface TimeSlot {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:00"
  isBooked: boolean;
  isActive: boolean;
  appointmentType: 'ONLINE_VIDEO' | 'IN_PERSON' | 'DOCUMENT_REVIEW';
}

export interface BlockedDate {
  date: string; // ISO date string "YYYY-MM-DD"
  reason?: string;
}

export interface ProfessionalSchedule {
  professionalId: string;
  weeklySlots: TimeSlot[];
  blockedDates: BlockedDate[];
  timezone: string;
  autoConfirmBooking: boolean;
  noticePeriodHours: number; // minimum notice required before booking
}
