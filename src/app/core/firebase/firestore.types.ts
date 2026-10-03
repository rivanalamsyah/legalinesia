/**
 * Firestore Document Type Definitions
 *
 * These interfaces define the exact shape of Firestore documents.
 * They map 1:1 with Firestore collections.
 *
 * Convention:
 * - All timestamps stored as Firestore Timestamp
 * - Optional fields use ?: notation
 * - Union status types are used (not string)
 * - IDs are document IDs (string), never embedded uid duplication
 */

import { Timestamp } from 'firebase/firestore';

// ─────────────────────────────────────────────────────────────
// ROLE & STATUS CONSTANTS
// ─────────────────────────────────────────────────────────────

export type FirestoreUserRole = 'CUSTOMER' | 'LEGAL_PRO' | 'ADMIN';
export type FirestoreUserStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type FirestoreVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type FirestoreBookingStatus =
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

export type FirestorePaymentStatus = 'WAITING_PAYMENT' | 'VERIFYING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type FirestoreAppointmentType = 'ONLINE_VIDEO' | 'IN_PERSON' | 'DOCUMENT_REVIEW';
export type FirestoreNotificationType = 'BOOKING' | 'PAYMENT' | 'REVIEW' | 'SYSTEM' | 'VERIFICATION';
export type FirestoreReviewStatus = 'PENDING' | 'PUBLISHED' | 'FLAGGED' | 'HIDDEN';
export type FirestoreArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type FirestoreServicePriceUnit = 'per consultation' | 'per document' | 'per case' | 'flat rate';

// ─────────────────────────────────────────────────────────────
// COLLECTION: users
// Document ID = Firebase Auth UID
// ─────────────────────────────────────────────────────────────
export interface FirestoreUser {
  uid: string;                      // = document ID
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: FirestoreUserRole;
  status: FirestoreUserStatus;
  isEmailVerified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // CUSTOMER-specific
  customerType?: 'INDIVIDUAL' | 'BUSINESS';
  companyName?: string;
  city?: string;

  // LEGAL_PRO-specific (core identity — extended profile in /professionals)
  barLicenseNumber?: string;
  verificationStatus?: FirestoreVerificationStatus;

  // ADMIN-specific
  department?: string;
}

// ─────────────────────────────────────────────────────────────
// COLLECTION: professionals
// Document ID = Firebase Auth UID (same as users)
// Extended profile for public-facing legal professional data
// ─────────────────────────────────────────────────────────────
export interface FirestoreProfessional {
  uid: string;                      // = document ID = users.uid
  slug: string;                     // URL-friendly name
  fullName: string;                 // Denormalized for display
  title: string;                    // e.g., "Advokat Senior & Konsultan Hukum Bisnis"
  avatarUrl?: string;
  barLicenseNumber: string;         // NIA/PERADI license number
  bio: string;
  headline?: string;                // Short headline for cards
  locationCity: string;
  practiceAreaIds: string[];        // References to /practice_areas
  specializations: string[];        // Freeform specialization tags
  education: string[];
  languages: string[];
  yearsOfExperience: number;
  consultationFee: number;          // IDR per session
  lawFirmName?: string;
  officeAddress?: string;

  // Aggregates (updated when reviews are submitted)
  rating: number;                   // Avg rating 0-5
  reviewCount: number;
  casesCompleted: number;

  // Visibility & Status
  isVerified: boolean;              // Admin-set after verification
  verificationStatus: FirestoreVerificationStatus;
  isProfileVisible: boolean;        // Professional can hide profile
  isAvailableToday: boolean;        // Computed or manually set

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────
// COLLECTION: practice_areas
// Master taxonomy. Admin-managed.
// ─────────────────────────────────────────────────────────────
export interface FirestorePracticeArea {
  slug: string;
  name: string;
  description: string;
  iconName: string;
  order: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────
// COLLECTION: legal_services
// Service catalog. Admin-managed globally; professionals can associate.
// ─────────────────────────────────────────────────────────────
export interface FirestoreLegalService {
  slug: string;
  title: string;
  practiceAreaId: string;           // Reference to /practice_areas
  practiceAreaName: string;         // Denormalized for display
  summary: string;
  description: string;
  iconName: string;
  startingPrice: number;
  priceUnit: FirestoreServicePriceUnit;
  estimatedDuration: string;
  keyFeatures: string[];
  deliverables: string[];
  recommendedFor: string[];
  isPopular?: boolean;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────
// COLLECTION: bookings
// Domain entity — core of the platform
// ─────────────────────────────────────────────────────────────
export interface FirestoreBookingTimelineEvent {
  status: FirestoreBookingStatus;
  label: string;
  timestamp: Timestamp;
  note?: string;
  actorId?: string;               // UID of actor who triggered event
}

export interface FirestoreBooking {
  // Ownership — these are indexed for querying
  customerId: string;             // Firebase Auth UID
  professionalId: string;         // Firebase Auth UID

  // Denormalized snapshot at booking time (never changes after booking)
  customerSnapshot: {
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
  professionalSnapshot: {
    fullName: string;
    title: string;
    avatarUrl?: string;
    barLicenseNumber: string;
  };

  // Service reference
  serviceId: string;

  // Denormalized service snapshot (locked at booking time)
  serviceSnapshot: {
    title: string;
    practiceAreaName: string;
    appointmentType: FirestoreAppointmentType;
    consultationFee: number;
  };

  // Schedule
  selectedDate: string;           // 'YYYY-MM-DD'
  selectedTimeSlot: string;       // '14:00 - 15:00 WIB'

  // Problem
  problemCategory: string;
  problemDescription: string;

  // Status (state machine enforced at service layer + Security Rules)
  status: FirestoreBookingStatus;
  paymentStatus: 'UNPAID' | 'WAITING_VERIFICATION' | 'PAID' | 'REFUNDED';

  // Meeting
  meetingUrl?: string;

  // History
  timeline: FirestoreBookingTimelineEvent[];
  cancellationReason?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────
// COLLECTION: payments
// Separate from booking status. Payment lifecycle is independent.
// ─────────────────────────────────────────────────────────────
export interface FirestorePayment {
  bookingId: string;
  customerId: string;             // Firebase Auth UID — indexed
  professionalId: string;         // Firebase Auth UID — indexed

  // Snapshot from booking
  serviceTitle: string;
  professionalName: string;
  amount: number;                 // IDR

  paymentMethod?: string;         // e.g., "Bank Transfer BCA Virtual Account"
  virtualAccountNumber?: string;  // Generated VA number for manual transfer
  transactionReference?: string;  // Customer-provided reference after transfer

  status: FirestorePaymentStatus;

  verifiedAt?: Timestamp;         // Set by Admin on verification
  verifiedBy?: string;            // Admin UID who verified

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────
// COLLECTION: consultation_notes
// Sensitive — field-level access policy enforced in Security Rules
// ─────────────────────────────────────────────────────────────
export interface FirestoreConsultationNote {
  bookingId: string;
  customerId: string;             // Indexed
  professionalId: string;         // Indexed

  // Customer-visible fields (accessible when isSharedWithCustomer = true)
  title: string;
  caseCategory: string;
  summary: string;
  legalAdvice: string;
  actionItems: string[];

  // Professional-only fields (never returned to customer)
  // Note: Firestore cannot enforce field-level rules natively.
  // To truly separate: store confidentialNotes in a sub-collection or separate doc.
  // For MVP, Security Rules deny customer read of the whole note when confidentialNotes is set.
  confidentialNotes?: string;

  // Sharing control — set by professional
  isSharedWithCustomer: boolean;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────
// COLLECTION: reviews
// ─────────────────────────────────────────────────────────────
export interface FirestoreReview {
  bookingId: string;
  customerId: string;             // Indexed
  professionalId: string;         // Indexed

  // Denormalized snapshot
  customerName: string;
  customerAvatarUrl?: string;
  professionalName: string;
  serviceTitle: string;

  rating: number;                 // 1-5
  comment: string;
  status: FirestoreReviewStatus;

  // Professional reply
  replyText?: string;
  repliedAt?: Timestamp;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────
// COLLECTION: notifications
// ─────────────────────────────────────────────────────────────
export interface FirestoreNotification {
  userId: string;                 // Recipient — Firebase Auth UID — indexed
  title: string;
  message: string;
  type: FirestoreNotificationType;
  relatedId?: string;             // bookingId, paymentId, reviewId, etc.
  relatedRoute?: string;          // Deep link for navigation
  isRead: boolean;
  createdAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────
// COLLECTION: articles (insights)
// ─────────────────────────────────────────────────────────────
export interface FirestoreArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;               // Rich text / markdown
  featuredImageUrl?: string;
  practiceAreaId?: string;
  practiceAreaName?: string;
  authorId: string;              // UID of author (professional or admin)
  authorName: string;
  authorAvatarUrl?: string;
  tags: string[];
  status: FirestoreArticleStatus;
  publishedAt?: Timestamp;
  readTimeMinutes?: number;
  viewCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────
// COLLECTION: faqs
// ─────────────────────────────────────────────────────────────
export interface FirestoreFaq {
  question: string;
  answer: string;
  category?: string;
  order: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────
// COLLECTION: testimonials
// ─────────────────────────────────────────────────────────────
export interface FirestoreTestimonial {
  clientName: string;
  clientAvatarUrl?: string;
  rating: number;
  comment: string;
  caseCategory?: string;
  isActive: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────
// COLLECTION: availability
// Professional schedule management
// ─────────────────────────────────────────────────────────────
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface FirestoreAvailabilitySlot {
  professionalId: string;         // Indexed
  dayOfWeek: DayOfWeek;
  startTime: string;              // 'HH:MM'
  endTime: string;                // 'HH:MM'
  isAvailable: boolean;
  effectiveFrom?: string;         // 'YYYY-MM-DD'
  effectiveUntil?: string;        // 'YYYY-MM-DD'
  note?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────
// COLLECTION: settings
// Platform-wide configuration. Admin-managed.
// ─────────────────────────────────────────────────────────────
export interface FirestoreSettings {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  noticePeriodHours: number;     // Minimum hours before booking allowed
  maintenanceMode: boolean;
  updatedAt: Timestamp;
  updatedBy: string;             // Admin UID
}

// ─────────────────────────────────────────────────────────────
// COLLECTION: audit_logs
// Append-oriented operational audit trail.
// Note: Without Cloud Functions, client-side writes have limitations
// for true tamper-proofing. See Known Limitations in README.
// ─────────────────────────────────────────────────────────────
export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface FirestoreAuditLog {
  actorId: string;               // UID of admin performing action
  actorEmail: string;
  actorRole: FirestoreUserRole;
  action: string;                // e.g., 'VERIFY_PROFESSIONAL', 'CANCEL_BOOKING'
  entityType: string;            // e.g., 'professional', 'booking', 'payment'
  entityId: string;
  severity: AuditSeverity;
  metadata?: Record<string, string | number | boolean>; // Safe metadata only
  timestamp: Timestamp;
}

// ─────────────────────────────────────────────────────────────
// COLLECTION NAMES — single source of truth
// ─────────────────────────────────────────────────────────────
export const COLLECTIONS = {
  USERS: 'users',
  PROFESSIONALS: 'professionals',
  PRACTICE_AREAS: 'practice_areas',
  LEGAL_SERVICES: 'legal_services',
  BOOKINGS: 'bookings',
  PAYMENTS: 'payments',
  CONSULTATION_NOTES: 'consultation_notes',
  REVIEWS: 'reviews',
  NOTIFICATIONS: 'notifications',
  ARTICLES: 'insights',           // Collection name matches existing route
  FAQS: 'faqs',
  TESTIMONIALS: 'testimonials',
  AVAILABILITY: 'availability',
  SETTINGS: 'settings',
  AUDIT_LOGS: 'audit_logs',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
