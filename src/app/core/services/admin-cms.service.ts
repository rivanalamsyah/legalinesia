import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthStateService } from './auth-state.service';
import { UserProfile, CustomerProfile, LegalProfessionalProfile } from '../models/user.model';
import { UserRole } from '../models/role.enum';
import { BookingItem, BookingStatus } from '../models/booking.model';
import { LegalService, LegalServiceCategory } from '../models/legal-service.model';
import { InsightArticle } from '../models/insight.model';
import { MOCK_CUSTOMER_BOOKINGS } from './customer-booking.service';
import { MOCK_PRO_BOOKINGS } from './pro-booking.service';

export interface AdminVerificationRequest {
  id: string;
  professionalId: string;
  fullName: string;
  email: string;
  barAssociation: string;
  barLicenseNumber: string;
  specializations: string[];
  submittedAt: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  rejectionReason?: string;
  identityDocumentUrl?: string;
  barCertificateUrl?: string;
}

export interface AdminAuditLog {
  id: string;
  actorEmail: string;
  action: string;
  target: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface AdminReview {
  id: string;
  bookingId: string;
  clientName: string;
  professionalName: string;
  rating: number;
  comment: string;
  serviceTitle: string;
  createdAt: string;
  status: 'PUBLISHED' | 'FLAGGED' | 'HIDDEN';
}

export interface AdminBroadcastNotification {
  id: string;
  title: string;
  message: string;
  targetRole: 'ALL' | 'CUSTOMER' | 'LEGAL_PRO';
  sentAt: string;
  recipientCount: number;
}

export interface AdminFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface AdminPlatformSettings {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  noticePeriodHours: number;
  autoConfirmBookings: boolean;
  maintenanceMode: boolean;
}

export const MOCK_ADMIN_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'cust-demo-101',
    email: 'budi.santoso@example.com',
    fullName: 'Budi Santoso',
    role: UserRole.CUSTOMER,
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-10-01T10:00:00Z',
    phoneNumber: '+6281234567890',
    isEmailVerified: true,
    customerType: 'INDIVIDUAL',
    city: 'Jakarta Selatan',
    isActive: true
  },
  {
    id: 'cust-demo-102',
    email: 'siti.rahma@example.com',
    fullName: 'Siti Rahmawati',
    role: UserRole.CUSTOMER,
    createdAt: '2026-09-15T10:30:00Z',
    updatedAt: '2026-10-02T14:00:00Z',
    phoneNumber: '+6281987654321',
    isEmailVerified: true,
    customerType: 'INDIVIDUAL',
    city: 'Bandung',
    isActive: true
  },
  {
    id: 'cust-demo-103',
    email: 'rudi@majubersama.co.id',
    fullName: 'CV Maju Bersama (Rudi)',
    role: UserRole.CUSTOMER,
    createdAt: '2026-09-28T09:00:00Z',
    updatedAt: '2026-10-03T11:00:00Z',
    phoneNumber: '+6281122334455',
    isEmailVerified: true,
    customerType: 'BUSINESS',
    companyName: 'CV Maju Bersama',
    city: 'Surabaya',
    isActive: true
  }
];

export const MOCK_ADMIN_PROS: LegalProfessionalProfile[] = [
  {
    id: 'pro-demo-202',
    email: 'bambang.sutrisno@legalinesia.id',
    fullName: 'Bambang Sutrisno, S.H., M.H.',
    role: UserRole.LEGAL_PRO,
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-09-20T15:00:00Z',
    isEmailVerified: true,
    title: 'Advokat Senior & Konsultan Hukum Bisnis',
    barLicenseNumber: 'PERADI/2012/84729',
    specializations: ['Hukum Bisnis & Korporasi', 'HKI', 'Hukum Kontrak'],
    yearsOfExperience: 14,
    consultationFee: 350000,
    locationCity: 'Jakarta Selatan',
    isVerified: true,
    rating: 4.9,
    reviewCount: 48,
    bio: 'Advokat senior spesialis hukum korporasi dan HKI.',
    education: ['S.H. Universitas Indonesia', 'M.H. Universitas Gadjah Mada'],
    languages: ['Bahasa Indonesia', 'English']
  },
  {
    id: 'lawyer-2',
    email: 'anisa.rahma@legalinesia.id',
    fullName: 'Dr. Anisa Rahmawati, S.H., M.Kn.',
    role: UserRole.LEGAL_PRO,
    createdAt: '2026-08-10T11:00:00Z',
    updatedAt: '2026-09-25T11:00:00Z',
    isEmailVerified: true,
    title: 'Advokat Specialist Hukum Keluarga & Waris',
    barLicenseNumber: 'PERADI/2015/92831',
    specializations: ['Perceraian & Keluarga', 'Hukum Waris'],
    yearsOfExperience: 11,
    consultationFee: 300000,
    locationCity: 'Jakarta Pusat',
    isVerified: true,
    rating: 4.8,
    reviewCount: 32,
    bio: 'Spesialis hukum keluarga dan hukum waris perdata.',
    education: ['S.H. Universitas Padjadjaran', 'M.Kn. Universitas Indonesia'],
    languages: ['Bahasa Indonesia']
  },
  {
    id: 'lawyer-3',
    email: 'hendra.wijaya@legalinesia.id',
    fullName: 'Hendra Wijaya, S.H., LL.M.',
    role: UserRole.LEGAL_PRO,
    createdAt: '2026-10-01T09:00:00Z',
    updatedAt: '2026-10-01T09:00:00Z',
    isEmailVerified: true,
    title: 'Advokat Konsultan HKI & Cyber Law',
    barLicenseNumber: 'PERADI/2017/63910',
    specializations: ['HKI & Cyber Law', 'Perlindungan Data'],
    yearsOfExperience: 9,
    consultationFee: 400000,
    locationCity: 'Tangerang Selatan',
    isVerified: false,
    rating: 0,
    reviewCount: 0,
    bio: 'Konsultan HKI terdaftar dan pakar hukum siber.',
    education: ['S.H. Universitas Airlangga', 'LL.M. Utrecht University'],
    languages: ['Bahasa Indonesia', 'English']
  }
];

export const MOCK_PRACTICE_AREAS: LegalServiceCategory[] = [
  {
    id: 'pa-1',
    slug: 'hukum-bisnis',
    name: 'Hukum Bisnis & Korporasi',
    description: 'Pendirian badan usaha PT/CV, legal audit, izin OSS RBA, dan restrukturisasi korporasi.',
    iconName: 'building-2',
    popularServicesCount: 12
  },
  {
    id: 'pa-2',
    slug: 'hukum-kontrak',
    name: 'Hukum Kontrak & Perjanjian',
    description: 'Review, drafting, dan analisis risiko perjanjian bisnis, MOU, PKS, serta klausul NDA.',
    iconName: 'file-check',
    popularServicesCount: 8
  },
  {
    id: 'pa-3',
    slug: 'hki-hak-cipta',
    name: 'HKI & Hak Cipta',
    description: 'Pendaftaran merek dagang DJKI, hak cipta, paten, lisensi, dan somasi sengketa merek.',
    iconName: 'shield',
    popularServicesCount: 6
  },
  {
    id: 'pa-4',
    slug: 'perceraian-keluarga',
    name: 'Perceraian & Hukum Keluarga',
    description: 'Konsultasi perceraian, pembagian harta gono-gini, hak asuh anak, dan perjanjian pra-nikah.',
    iconName: 'users',
    popularServicesCount: 9
  }
];

export const MOCK_ADMIN_REVIEWS: AdminReview[] = [
  {
    id: 'rev-1',
    bookingId: 'BK-202609-020',
    clientName: 'Budi Santoso',
    professionalName: 'Bambang Sutrisno, S.H., M.H.',
    rating: 5,
    comment: 'Penjelasan Pak Bambang sangat lugas dan memberikan arah mitigasi sengketa merek yang sangat jelas. Sangat profesional!',
    serviceTitle: 'Pendampingan Sengketa Merek & Lisensi',
    createdAt: '2026-09-21T10:00:00Z',
    status: 'PUBLISHED'
  },
  {
    id: 'rev-2',
    bookingId: 'BK-202609-044',
    clientName: 'Siti Rahmawati',
    professionalName: 'Dr. Anisa Rahmawati, S.H., M.Kn.',
    rating: 5,
    comment: 'Sangat terbantu untuk audit draf perjanjian pemisahan harta pra-nikah. Penjelasan klausul risikonya detail.',
    serviceTitle: 'Review & Drafting Perjanjian Kerjasama',
    createdAt: '2026-09-26T14:00:00Z',
    status: 'PUBLISHED'
  }
];

export const MOCK_ADMIN_NOTIFICATIONS: AdminBroadcastNotification[] = [
  {
    id: 'notif-1',
    title: 'Pembaruan Fitur Consultation Notes 2.0',
    message: 'Fitur resume nasihat hukum kini dapat langsung diakses oleh Klien melalui portal.',
    targetRole: 'ALL',
    sentAt: '2026-10-01 09:00 WIB',
    recipientCount: 1420
  }
];

export const MOCK_ADMIN_FAQS: AdminFaqItem[] = [
  {
    id: 'faq-1',
    question: 'Bagaimana cara menjadwalkan konsultasi hukum online di Legalinesia?',
    answer: 'Anda cukup memilih Advokat atau Layanan Hukum yang sesuai, tentukan tanggal serta slot jam yang tersedia, dan selesaikan pembayaran.',
    category: 'Umum',
    order: 1,
    isActive: true
  },
  {
    id: 'faq-2',
    question: 'Apakah seluruh Advokat di Legalinesia telah terverifikasi resmi?',
    answer: 'Ya, seluruh advokat terverifikasi melalui sertifikat keanggotaan organisasi PERADI/KAI dan Nomor Induk Advokat (NIA) aktif.',
    category: 'Advokat & Verifikasi',
    order: 2,
    isActive: true
  }
];

export const MOCK_ADMIN_INSIGHTS: InsightArticle[] = [
  {
    id: 'art-1',
    slug: 'panduan-pendirian-pt-pma-2026',
    title: 'Panduan Lengkap Syarat & Biaya Pendirian PT PMA Tahun 2026',
    excerpt: 'Langkah hukum dan kualifikasi KBLI untuk pendirian PT Penanaman Modal Asing di Indonesia melalui OSS RBA.',
    contentHtml: '<p>Pendirian PT PMA di Indonesia memerlukan pemahaman ketat mengenai Daftar Positif Investasi (DPI)...</p>',
    category: 'Hukum Bisnis & Korporasi',
    authorName: 'Bambang Sutrisno, S.H., M.H.',
    authorTitle: 'Advokat Senior & Konsultan Hukum Bisnis',
    authorAvatar: '/images/avatars/avatar-male-1.png',
    publishedAt: '2026-09-28',
    readTimeMinutes: 5,
    coverImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    tags: ['PT PMA', 'OSS RBA', 'Hukum Bisnis'],
    isFeatured: true
  },
  {
    id: 'art-2',
    slug: 'cara-menanggapi-surat-somasi-merek',
    title: 'Cara Menanggapi Surat Somasi Sengketa Merek Dagang',
    excerpt: 'Panduan taktis bagi pemilik brand dalam menanggapi tuduhan dugaan pelanggaran HKI tanpa panik.',
    contentHtml: '<p>Menerima surat somasi merek dagang bukan berarti Anda langsung bersalah secara legal...</p>',
    category: 'HKI & Hak Cipta',
    authorName: 'Tim Legalinesia',
    authorTitle: 'Platform Legal Tech Indonesia',
    authorAvatar: '/images/avatars/avatar-male-2.png',
    publishedAt: '2026-10-02',
    readTimeMinutes: 4,
    coverImageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
    tags: ['HKI', 'Somasi', 'Merek']
  }
];

export const MOCK_ADMIN_VERIFICATIONS: AdminVerificationRequest[] = [
  {
    id: 'ver-001',
    professionalId: 'lawyer-3',
    fullName: 'Hendra Wijaya, S.H., LL.M.',
    email: 'hendra.wijaya@legalinesia.id',
    barAssociation: 'PERADI (Perhimpunan Advokat Indonesia)',
    barLicenseNumber: 'PERADI/2017/63910',
    specializations: ['HKI & Cyber Law', 'Perlindungan Data'],
    submittedAt: '2026-10-01 09:00 WIB',
    status: 'PENDING',
    barCertificateUrl: 'Sertifikat_PERADI_Hendra.pdf',
    identityDocumentUrl: 'KTP_Hendra_Wijaya.pdf'
  }
];

export const MOCK_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log-1',
    actorEmail: 'admin@legalinesia.id',
    action: 'VERIFY_ADVOCATE_SUCCESS',
    target: 'Bambang Sutrisno, S.H., M.H.',
    timestamp: '2026-09-20 15:00 WIB',
    severity: 'INFO'
  },
  {
    id: 'log-2',
    actorEmail: 'system',
    action: 'PAYMENT_VERIFIED_AUTOMATIC',
    target: 'BK-202610-001',
    timestamp: '2026-10-02 09:00 WIB',
    severity: 'INFO'
  }
];

@Injectable({
  providedIn: 'root'
})
export class AdminCmsService {
  private readonly authState = inject(AuthStateService);

  private readonly customersSignal = signal<CustomerProfile[]>(MOCK_ADMIN_CUSTOMERS);
  private readonly prosSignal = signal<LegalProfessionalProfile[]>(MOCK_ADMIN_PROS);
  private readonly practiceAreasSignal = signal<LegalServiceCategory[]>(MOCK_PRACTICE_AREAS);
  private readonly verificationsSignal = signal<AdminVerificationRequest[]>(MOCK_ADMIN_VERIFICATIONS);
  private readonly auditLogsSignal = signal<AdminAuditLog[]>(MOCK_AUDIT_LOGS);
  private readonly reviewsSignal = signal<AdminReview[]>(MOCK_ADMIN_REVIEWS);
  private readonly notificationsSignal = signal<AdminBroadcastNotification[]>(MOCK_ADMIN_NOTIFICATIONS);
  private readonly faqsSignal = signal<AdminFaqItem[]>(MOCK_ADMIN_FAQS);
  private readonly insightsSignal = signal<InsightArticle[]>(MOCK_ADMIN_INSIGHTS);
  private readonly settingsSignal = signal<AdminPlatformSettings>({
    siteName: 'Legalinesia Platform',
    supportEmail: 'support@legalinesia.id',
    supportPhone: '+622150009999',
    noticePeriodHours: 24,
    autoConfirmBookings: false,
    maintenanceMode: false
  });

  // Combine bookings across platform
  private readonly allBookingsSignal = signal<BookingItem[]>([
    ...MOCK_PRO_BOOKINGS,
    ...MOCK_CUSTOMER_BOOKINGS.filter(cb => !MOCK_PRO_BOOKINGS.some(pb => pb.id === cb.id))
  ]);

  public readonly customers = computed(() => this.customersSignal());
  public readonly professionals = computed(() => this.prosSignal());
  public readonly practiceAreas = computed(() => this.practiceAreasSignal());
  public readonly verifications = computed(() => this.verificationsSignal());
  public readonly auditLogs = computed(() => this.auditLogsSignal());
  public readonly allBookings = computed(() => this.allBookingsSignal());
  public readonly reviews = computed(() => this.reviewsSignal());
  public readonly notifications = computed(() => this.notificationsSignal());
  public readonly faqs = computed(() => this.faqsSignal());
  public readonly insights = computed(() => this.insightsSignal());
  public readonly settings = computed(() => this.settingsSignal());

  public readonly pendingVerificationsCount = computed(() => {
    return this.verificationsSignal().filter(v => v.status === 'PENDING').length;
  });

  public readonly pendingPaymentsCount = computed(() => {
    return this.allBookingsSignal().filter(b => b.status === 'WAITING_PAYMENT' || b.paymentStatus === 'UNPAID').length;
  });

  public readonly totalPlatformRevenue = computed(() => {
    return this.allBookingsSignal()
      .filter(b => b.paymentStatus === 'PAID' || b.status === 'COMPLETED')
      .reduce((sum, b) => sum + (b.consultationFee || 0), 0);
  });

  public approveVerification(reqId: string): void {
    const list = this.verificationsSignal();
    const req = list.find(v => v.id === reqId);
    if (!req) return;

    const updatedVerifications = list.map(v => v.id === reqId ? { ...v, status: 'VERIFIED' as const } : v);
    this.verificationsSignal.set(updatedVerifications);

    const updatedPros = this.prosSignal().map(p => p.id === req.professionalId ? { ...p, isVerified: true } : p);
    this.prosSignal.set(updatedPros);

    this.addAuditLog('VERIFY_ADVOCATE_APPROVED', req.fullName, 'INFO');
  }

  public rejectVerification(reqId: string, reason: string): void {
    const list = this.verificationsSignal();
    const req = list.find(v => v.id === reqId);
    if (!req) return;

    const updatedVerifications = list.map(v => v.id === reqId ? { ...v, status: 'REJECTED' as const, rejectionReason: reason } : v);
    this.verificationsSignal.set(updatedVerifications);

    this.addAuditLog('VERIFY_ADVOCATE_REJECTED', `${req.fullName} (Alasan: ${reason})`, 'WARNING');
  }

  public toggleUserActive(userId: string): void {
    const custs = this.customersSignal();
    const idx = custs.findIndex(c => c.id === userId);
    if (idx !== -1) {
      const updated = [...custs];
      updated[idx] = { ...updated[idx], isActive: !updated[idx].isActive };
      this.customersSignal.set(updated);
      this.addAuditLog('TOGGLE_USER_ACTIVE', updated[idx].email, 'WARNING');
    }
  }

  public addPracticeArea(areaData: Omit<LegalServiceCategory, 'id' | 'slug' | 'popularServicesCount'>): void {
    const slug = areaData.name.toLowerCase().replace(/\s+/g, '-');
    const newArea: LegalServiceCategory = {
      id: `pa-${Date.now()}`,
      slug,
      name: areaData.name,
      description: areaData.description,
      iconName: areaData.iconName || 'folder',
      popularServicesCount: 0
    };

    this.practiceAreasSignal.set([...this.practiceAreasSignal(), newArea]);
    this.addAuditLog('CREATE_PRACTICE_AREA', newArea.name, 'INFO');
  }

  public verifyBookingPayment(bookingId: string): void {
    const list = this.allBookingsSignal();
    const updated = list.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          paymentStatus: 'PAID' as const,
          status: 'CONFIRMED' as BookingStatus,
          timeline: [
            ...b.timeline,
            { status: 'CONFIRMED' as BookingStatus, label: 'Pembayaran Diverifikasi oleh Admin Platform', timestamp: new Date().toLocaleString('id-ID') }
          ]
        };
      }
      return b;
    });

    this.allBookingsSignal.set(updated);
    this.addAuditLog('MANUAL_PAYMENT_VERIFIED', bookingId, 'INFO');
  }

  public moderateReview(reviewId: string, status: 'PUBLISHED' | 'FLAGGED' | 'HIDDEN'): void {
    const list = this.reviewsSignal();
    const updated = list.map(r => r.id === reviewId ? { ...r, status } : r);
    this.reviewsSignal.set(updated);
    this.addAuditLog('MODERATE_REVIEW', `Review ID ${reviewId} -> ${status}`, 'WARNING');
  }

  public dispatchBroadcastNotification(title: string, message: string, targetRole: 'ALL' | 'CUSTOMER' | 'LEGAL_PRO'): void {
    const newNotif: AdminBroadcastNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      targetRole,
      sentAt: new Date().toLocaleString('id-ID'),
      recipientCount: targetRole === 'ALL' ? 1420 : targetRole === 'CUSTOMER' ? 1334 : 86
    };

    this.notificationsSignal.set([newNotif, ...this.notificationsSignal()]);
    this.addAuditLog('DISPATCH_BROADCAST_NOTIFICATION', `${title} (Target: ${targetRole})`, 'INFO');
  }

  public addFaq(question: string, answer: string, category: string): void {
    const newFaq: AdminFaqItem = {
      id: `faq-${Date.now()}`,
      question,
      answer,
      category,
      order: this.faqsSignal().length + 1,
      isActive: true
    };
    this.faqsSignal.set([...this.faqsSignal(), newFaq]);
    this.addAuditLog('CREATE_FAQ_ITEM', question, 'INFO');
  }

  public addInsightArticle(article: Omit<InsightArticle, 'id'>): { success: boolean; message?: string } {
    if (!article.slug || !article.title) {
      return { success: false, message: 'Judul dan slug artikel wajib diisi.' };
    }

    if (this.insightsSignal().some(a => a.slug === article.slug)) {
      return { success: false, message: `Slug artikel "${article.slug}" sudah digunakan.` };
    }

    const newArticle: InsightArticle = {
      ...article,
      id: `art-${Date.now()}`
    };

    this.insightsSignal.set([newArticle, ...this.insightsSignal()]);
    this.addAuditLog('CREATE_INSIGHT_ARTICLE', article.title, 'INFO');
    return { success: true };
  }

  public updatePlatformSettings(data: Partial<AdminPlatformSettings>): void {
    this.settingsSignal.set({ ...this.settingsSignal(), ...data });
    this.addAuditLog('UPDATE_PLATFORM_SETTINGS', 'Pengaturan Platform Diperbarui', 'WARNING');
  }

  // Strict Append-Only audit log recorder (No delete or edit!)
  private addAuditLog(action: string, target: string, severity: 'INFO' | 'WARNING' | 'CRITICAL'): void {
    const user = this.authState.currentUser();
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      actorEmail: user?.email || 'admin@legalinesia.id',
      action,
      target,
      timestamp: new Date().toLocaleString('id-ID'),
      severity
    };
    this.auditLogsSignal.set([newLog, ...this.auditLogsSignal()]);
  }
}
