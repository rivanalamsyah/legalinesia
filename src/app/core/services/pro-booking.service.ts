import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthStateService } from './auth-state.service';
import { BookingItem, BookingStatus, canTransitionBooking } from '../models/booking.model';
import { ConsultationNote } from '../models/consultation-note.model';
import { ProfessionalSchedule, TimeSlot, BlockedDate } from '../models/schedule.model';
import { LegalService } from '../models/legal-service.model';

export interface ProClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalBookings: number;
  lastConsultationDate: string;
  activeCasesCount: number;
}

export interface ProReview {
  id: string;
  bookingId: string;
  clientName: string;
  rating: number; // 1-5
  comment: string;
  serviceTitle: string;
  createdAt: string;
  reply?: string;
}

export const MOCK_PRO_BOOKINGS: BookingItem[] = [
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

    selectedDate: new Date().toISOString().split('T')[0], // Today!
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
    id: 'BK-202610-005',
    customerId: 'cust-demo-102',
    customerName: 'Siti Rahmawati',
    customerEmail: 'siti.rahma@example.com',
    customerPhone: '+6281987654321',

    professionalId: 'pro-demo-202',
    professionalName: 'Bambang Sutrisno, S.H., M.H.',
    professionalTitle: 'Advokat Senior & Konsultan Hukum Bisnis',
    barLicenseNumber: 'PERADI/2012/84729',

    serviceId: 'srv-2',
    serviceTitle: 'Review & Drafting Perjanjian Kerjasama (MOU/PKS)',
    practiceArea: 'Hukum Kontrak & Perjanjian',
    appointmentType: 'DOCUMENT_REVIEW',

    selectedDate: new Date().toISOString().split('T')[0], // Today!
    selectedTimeSlot: '16:00 - 17:00 WIB',
    consultationFee: 500000,
    paymentStatus: 'PAID',

    problemCategory: 'Review Perjanjian Kerjasama',
    problemDescription: 'Review klausul kerahasiaan NDA dan klausul pembagian hasil perjanjian kemitraan.',
    documentAttachments: ['Draft_MOU_Kemitraan_2026.docx'],
    meetingUrl: 'https://meet.google.com/bambang-review-doc',
    status: 'IN_SESSION',
    createdAt: '2026-10-02T14:00:00Z',
    updatedAt: '2026-10-03T09:00:00Z',
    timeline: [
      { status: 'REQUESTED', label: 'Booking diajukan oleh Klien', timestamp: '2026-10-02 14:00 WIB' },
      { status: 'CONFIRMED', label: 'Dikonfirmasi', timestamp: '2026-10-02 15:00 WIB' },
      { status: 'IN_SESSION', label: 'Sesi Peninjauan Dimulai', timestamp: '2026-10-03 09:00 WIB' }
    ]
  },
  {
    id: 'BK-202610-012',
    customerId: 'cust-demo-103',
    customerName: 'CV Maju Bersama (Rudi)',
    customerEmail: 'rudi@majubersama.co.id',
    customerPhone: '+6281122334455',

    professionalId: 'pro-demo-202',
    professionalName: 'Bambang Sutrisno, S.H., M.H.',
    professionalTitle: 'Advokat Senior & Konsultan Hukum Bisnis',

    serviceId: 'srv-1',
    serviceTitle: 'Pendirian PT & Pengurusan NIB OSS RBA',
    practiceArea: 'Hukum Bisnis & Korporasi',
    appointmentType: 'ONLINE_VIDEO',

    selectedDate: '2026-10-08',
    selectedTimeSlot: '10:00 - 11:00 WIB',
    consultationFee: 350000,
    paymentStatus: 'UNPAID',

    problemCategory: 'Perubahan Anggaran Dasar PT',
    problemDescription: 'Konsultasi perubahan struktur pemegang saham dan peningkatan modal disetor.',
    status: 'REQUESTED',
    createdAt: '2026-10-03T11:00:00Z',
    updatedAt: '2026-10-03T11:00:00Z',
    timeline: [
      { status: 'REQUESTED', label: 'Permintaan booking baru diterima', timestamp: '2026-10-03 11:00 WIB' }
    ]
  },
  {
    id: 'BK-202609-020',
    customerId: 'cust-demo-101',
    customerName: 'Budi Santoso',
    customerEmail: 'budi.santoso@example.com',

    professionalId: 'pro-demo-202',
    professionalName: 'Bambang Sutrisno, S.H., M.H.',
    professionalTitle: 'Advokat Senior & Konsultan Hukum Bisnis',

    serviceId: 'srv-4',
    serviceTitle: 'Pendampingan Sengketa Merek & Lisensi',
    practiceArea: 'HKI & Hak Cipta',
    appointmentType: 'IN_PERSON',

    selectedDate: '2026-09-20',
    selectedTimeSlot: '13:00 - 14:30 WIB',
    consultationFee: 750000,
    paymentStatus: 'PAID',

    problemCategory: 'Sengketa Merek Dagang',
    problemDescription: 'Konsultasi somasi pelanggaran hak merek terdaftar.',
    status: 'COMPLETED',
    createdAt: '2026-09-15T09:00:00Z',
    updatedAt: '2026-09-20T15:00:00Z',
    timeline: [
      { status: 'REQUESTED', label: 'Booking diajukan', timestamp: '2026-09-15 09:00 WIB' },
      { status: 'CONFIRMED', label: 'Dikonfirmasi', timestamp: '2026-09-16 10:00 WIB' },
      { status: 'COMPLETED', label: 'Konsultasi Selesai', timestamp: '2026-09-20 15:00 WIB' }
    ]
  }
];

export const MOCK_CONSULTATION_NOTES: ConsultationNote[] = [
  {
    id: 'CN-202609-001',
    bookingId: 'BK-202609-020',
    customerId: 'cust-demo-101',
    customerName: 'Budi Santoso',
    professionalId: 'pro-demo-202',
    professionalName: 'Bambang Sutrisno, S.H., M.H.',
    title: 'Catatan Hukum: Analisis Sengketa Merek Dagang "LegalTech ID"',
    caseCategory: 'HKI & Hak Cipta',
    summary: 'Klien menghadapi somasi atas dugaan kemiripan nama merek dengan pihak ketiga.',
    legalAdvice: 'Nama merek klien telah terdaftar di Kelas 42 DJKI sejak 2024. Somasi lawan dapat ditanggapi dengan bukti sertifikat merek aktif dan permohonan rekonvensi bila diperlukan.',
    actionItems: [
      'Menyiapkan tanggapan resmi surat somasi dalam 7 hari kerja.',
      'Melengkapi salinan Sertifikat Merek DJKI No. IDM00098765.',
      'Menjadwalkan mediasi pra-litigasi dengan pihak pelapor.'
    ],
    confidentialNotes: 'Lawan kemungkinan besar tidak memiliki basis legal kuat di Kelas 42. Pertahankan posisi.',
    attachments: [
      {
        id: 'att-1',
        fileName: 'Tanggapan_Somasi_Draft.pdf',
        fileSize: 1048576,
        fileType: 'application/pdf',
        fileUrl: '#',
        uploadedAt: '2026-09-20T16:00:00Z',
        uploadedByUid: 'pro-demo-202'
      }
    ],
    isSharedWithCustomer: true,
    createdAt: '2026-09-20T15:30:00Z',
    updatedAt: '2026-09-20T15:30:00Z'
  }
];

export const MOCK_PRO_REVIEWS: ProReview[] = [
  {
    id: 'rev-1',
    bookingId: 'BK-202609-020',
    clientName: 'Budi Santoso',
    rating: 5,
    comment: 'Penjelasan Pak Bambang sangat lugas dan memberikan arah mitigasi sengketa merek yang sangat jelas. Sangat profesional!',
    serviceTitle: 'Pendampingan Sengketa Merek & Lisensi',
    createdAt: '2026-09-21T10:00:00Z',
    reply: 'Terima kasih atas kepercayaannya Pak Budi. Sukses selalu untuk usahanya.'
  }
];

export const MOCK_PRO_SCHEDULE: ProfessionalSchedule = {
  professionalId: 'pro-demo-202',
  timezone: 'Asia/Jakarta (WIB)',
  autoConfirmBooking: false,
  noticePeriodHours: 24,
  weeklySlots: [
    { id: 'ts-1', dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '11:00', isBooked: false, isActive: true, appointmentType: 'ONLINE_VIDEO' },
    { id: 'ts-2', dayOfWeek: 'MONDAY', startTime: '14:00', endTime: '16:00', isBooked: false, isActive: true, appointmentType: 'ONLINE_VIDEO' },
    { id: 'ts-3', dayOfWeek: 'TUESDAY', startTime: '10:00', endTime: '12:00', isBooked: false, isActive: true, appointmentType: 'DOCUMENT_REVIEW' },
    { id: 'ts-4', dayOfWeek: 'WEDNESDAY', startTime: '09:00', endTime: '12:00', isBooked: false, isActive: true, appointmentType: 'ONLINE_VIDEO' },
    { id: 'ts-5', dayOfWeek: 'THURSDAY', startTime: '13:00', endTime: '16:00', isBooked: false, isActive: true, appointmentType: 'IN_PERSON' },
    { id: 'ts-6', dayOfWeek: 'FRIDAY', startTime: '09:00', endTime: '11:30', isBooked: false, isActive: true, appointmentType: 'ONLINE_VIDEO' }
  ],
  blockedDates: [
    { date: '2026-10-15', reason: 'Sidang Lapangan PN Jakarta Selatan' }
  ]
};

export const MOCK_PRO_SERVICES: LegalService[] = [
  {
    id: 'srv-1',
    slug: 'pendirian-pt',
    title: 'Pendirian PT & Pengurusan NIB OSS RBA',
    categorySlug: 'hukum-bisnis',
    categoryName: 'Hukum Bisnis & Korporasi',
    summary: 'Konsultasi kualifikasi KBLI dan penyusunan Akta Pendirian PT.',
    description: 'Konsultasi kualifikasi KBLI, penyusunan Akta Pendirian, SK Kemenkumham, dan NIB OSS RBA.',
    iconName: 'building-2',
    startingPrice: 350000,
    priceUnit: 'per consultation',
    estimatedDuration: '60 Menit',
    keyFeatures: ['Analisis KBLI 2020', 'Draft Akta Notaris', 'Panduan OSS RBA', 'Sesi Tanya Jawab Live'],
    deliverables: ['Ringkasan Advis Hukum', 'Draf Akta Notaris'],
    recommendedFor: ['Startup Baru', 'UMKM Naik Kelas'],
    isPopular: true
  },
  {
    id: 'srv-2',
    slug: 'review-perjanjian',
    title: 'Review & Drafting Perjanjian Kerjasama (MOU/PKS)',
    categorySlug: 'hukum-kontrak',
    categoryName: 'Hukum Kontrak & Perjanjian',
    summary: 'Peninjauan mendalam klausul risiko dan NDA.',
    description: 'Peninjauan mendalam klausul risiko, kerahasiaan (NDA), dan hak kewajiban para pihak dalam perjanjian bisnis.',
    iconName: 'file-check',
    startingPrice: 500000,
    priceUnit: 'per document',
    estimatedDuration: '1 Hari Kerja',
    keyFeatures: ['Audit Klausul Risiko', 'Redrafting Halaman Kunci', 'Sertifikat Catatan Konsultasi'],
    deliverables: ['Draf Kontrak Ter-review', 'Matrix Risiko Klausul'],
    recommendedFor: ['Perusahaan Bisnis', 'Investor'],
    isPopular: false
  },
  {
    id: 'srv-4',
    slug: 'sengketa-merek',
    title: 'Pendampingan Sengketa Merek & Lisensi',
    categorySlug: 'hki-hak-cipta',
    categoryName: 'HKI & Hak Cipta',
    summary: 'Konsultasi penanganan somasi dan sanggahan merek.',
    description: 'Konsultasi hukum penanganan somasi, pelanggaran merek terdaftar, dan sengketa lisensi HKI.',
    iconName: 'shield',
    startingPrice: 750000,
    priceUnit: 'per case',
    estimatedDuration: '90 Menit',
    keyFeatures: ['Analisis DJKI Database', 'Draft Surat Balasan Somasi', 'Rekomendasi Strategi Mediasi'],
    deliverables: ['Draft Surat Somasi', 'Strategic Advice Note'],
    recommendedFor: ['Pemilik Brand', 'Franchisor'],
    isPopular: true
  }
];

@Injectable({
  providedIn: 'root'
})
export class ProBookingService {
  private readonly authState = inject(AuthStateService);

  private readonly bookingsSignal = signal<BookingItem[]>(MOCK_PRO_BOOKINGS);
  private readonly notesSignal = signal<ConsultationNote[]>(MOCK_CONSULTATION_NOTES);
  private readonly reviewsSignal = signal<ProReview[]>(MOCK_PRO_REVIEWS);
  private readonly scheduleSignal = signal<ProfessionalSchedule>(MOCK_PRO_SCHEDULE);
  private readonly servicesSignal = signal<LegalService[]>(MOCK_PRO_SERVICES);

  // Scoped to logged-in Legal Professional ONLY
  public readonly proBookings = computed(() => {
    const user = this.authState.currentUser();
    if (!user) return [];
    if (user.role === 'ADMIN') return this.bookingsSignal();
    // Scope check: user.id === professionalId or fallback demo ID 'pro-demo-202'
    return this.bookingsSignal().filter(b => b.professionalId === user.id || user.id === 'pro-demo-202' || user.id === 'lawyer-1');
  });

  public readonly todayDateStr = new Date().toISOString().split('T')[0];

  public readonly todayConsultations = computed(() => {
    return this.proBookings().filter(b => b.selectedDate === this.todayDateStr);
  });

  public readonly upcomingBookings = computed(() => {
    return this.proBookings().filter(b => b.status === 'CONFIRMED' || b.status === 'IN_SESSION');
  });

  public readonly pendingRequests = computed(() => {
    return this.proBookings().filter(b => b.status === 'REQUESTED' || b.status === 'UNDER_REVIEW');
  });

  public readonly completedConsultations = computed(() => {
    return this.proBookings().filter(b => b.status === 'COMPLETED');
  });

  // Calculate actual revenue metrics based on completed and verified bookings
  public readonly totalRevenue = computed(() => {
    return this.proBookings()
      .filter(b => b.status === 'COMPLETED' || b.paymentStatus === 'PAID')
      .reduce((sum, b) => sum + (b.consultationFee || 0), 0);
  });

  // Client roster derived strictly from pro's assigned bookings
  public readonly clientRoster = computed<ProClient[]>(() => {
    const bookings = this.proBookings();
    const map = new Map<string, ProClient>();

    bookings.forEach(b => {
      const existing = map.get(b.customerId);
      const isActive = b.status === 'CONFIRMED' || b.status === 'IN_SESSION' || b.status === 'REQUESTED';

      if (existing) {
        existing.totalBookings += 1;
        if (isActive) existing.activeCasesCount += 1;
        if (b.selectedDate > existing.lastConsultationDate) {
          existing.lastConsultationDate = b.selectedDate;
        }
      } else {
        map.set(b.customerId, {
          id: b.customerId,
          name: b.customerName,
          email: b.customerEmail,
          phone: b.customerPhone,
          totalBookings: 1,
          lastConsultationDate: b.selectedDate,
          activeCasesCount: isActive ? 1 : 0
        });
      }
    });

    return Array.from(map.values());
  });

  public readonly consultationNotes = computed(() => this.notesSignal());
  public readonly reviews = computed(() => this.reviewsSignal());
  public readonly schedule = computed(() => this.scheduleSignal());
  public readonly services = computed(() => this.servicesSignal());

  public readonly averageRating = computed(() => {
    const list = this.reviewsSignal();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / list.length) * 10) / 10;
  });

  public getBookingById(id: string): Observable<BookingItem | undefined> {
    const found = this.proBookings().find(b => b.id === id);
    return of(found);
  }

  public acceptBooking(id: string): boolean {
    return this.updateBookingStatus(id, 'UNDER_REVIEW', 'Booking diterima dan ditinjau oleh Advokat');
  }

  public confirmBooking(id: string): boolean {
    return this.updateBookingStatus(id, 'CONFIRMED', 'Jadwal konsultasi dikonfirmasi oleh Advokat');
  }

  public rejectBooking(id: string, reason: string): boolean {
    return this.updateBookingStatus(id, 'REJECTED', `Ditolak oleh Advokat: ${reason}`);
  }

  public startSession(id: string): boolean {
    return this.updateBookingStatus(id, 'IN_SESSION', 'Sesi konsultasi sedang berlangsung');
  }

  public completeSession(id: string): boolean {
    return this.updateBookingStatus(id, 'COMPLETED', 'Konsultasi telah selesai dilaksanakan');
  }

  public updateBookingStatus(id: string, targetStatus: BookingStatus, note?: string): boolean {
    const list = this.bookingsSignal();
    const index = list.findIndex(b => b.id === id);
    if (index === -1) return false;

    const currentBooking = list[index];
    if (!canTransitionBooking(currentBooking.status, targetStatus)) {
      console.warn(`[Pro State Machine Violation] Cannot transition from ${currentBooking.status} to ${targetStatus}`);
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
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString()
    };

    const updatedList = [...list];
    updatedList[index] = updatedBooking;
    this.bookingsSignal.set(updatedList);
    return true;
  }

  public createConsultationNote(noteData: Partial<ConsultationNote>): ConsultationNote {
    const currentUser = this.authState.currentUser();
    const newNote: ConsultationNote = {
      id: `CN-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`,
      bookingId: noteData.bookingId || '',
      customerId: noteData.customerId || '',
      customerName: noteData.customerName || 'Klien',
      professionalId: currentUser?.id || 'pro-demo-202',
      professionalName: currentUser?.fullName || 'Bambang Sutrisno, S.H., M.H.',
      title: noteData.title || 'Catatan Konsultasi Legal',
      caseCategory: noteData.caseCategory || 'Umum',
      summary: noteData.summary || '',
      legalAdvice: noteData.legalAdvice || '',
      actionItems: noteData.actionItems || [],
      confidentialNotes: noteData.confidentialNotes,
      attachments: noteData.attachments || [],
      isSharedWithCustomer: noteData.isSharedWithCustomer ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.notesSignal.set([newNote, ...this.notesSignal()]);
    return newNote;
  }

  public addReviewReply(reviewId: string, replyText: string): void {
    const list = this.reviewsSignal();
    const updated = list.map(r => r.id === reviewId ? { ...r, reply: replyText } : r);
    this.reviewsSignal.set(updated);
  }

  public toggleTimeSlot(slotId: string): void {
    const currentSched = this.scheduleSignal();
    const updatedSlots = currentSched.weeklySlots.map(s => {
      if (s.id === slotId) {
        return { ...s, isActive: !s.isActive };
      }
      return s;
    });
    this.scheduleSignal.set({ ...currentSched, weeklySlots: updatedSlots });
  }

  public addBlockedDate(dateStr: string, reason: string): void {
    const currentSched = this.scheduleSignal();
    const updatedBlocked = [...currentSched.blockedDates, { date: dateStr, reason }];
    this.scheduleSignal.set({ ...currentSched, blockedDates: updatedBlocked });
  }

  public addService(service: Omit<LegalService, 'id'>): void {
    const newId = `srv-${Date.now()}`;
    const newService: LegalService = { ...service, id: newId };
    this.servicesSignal.set([...this.servicesSignal(), newService]);
  }
}
