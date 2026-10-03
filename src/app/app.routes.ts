import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { PortalLayoutComponent } from './layouts/portal-layout/portal-layout.component';
import { roleGuard } from './core/guards/auth.guard';
import { UserRole } from './core/models/role.enum';

export const routes: Routes = [
  // ===== PUBLIC WEBSITE =====
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        title: 'LegalConnect - Platform Konsultasi Hukum & Direktori Advokat Terpercaya',
        loadComponent: () =>
          import('./features/public/home/home-page.component').then(m => m.HomePageComponent)
      },
      {
        path: 'services',
        title: 'Layanan Hukum',
        loadComponent: () =>
          import('./features/public/services/services-page.component').then(m => m.ServicesPageComponent)
      },
      {
        path: 'services/:slug',
        title: 'Detail Layanan Hukum',
        loadComponent: () =>
          import('./features/public/services/service-detail-page.component').then(m => m.ServiceDetailPageComponent)
      },
      {
        path: 'professionals',
        title: 'Direktori Advokat',
        loadComponent: () =>
          import('./features/public/professionals/professionals-page.component').then(m => m.ProfessionalsPageComponent)
      },
      {
        path: 'professionals/:id',
        title: 'Profil Advokat',
        loadComponent: () =>
          import('./features/public/professionals/professional-detail-page.component').then(m => m.ProfessionalDetailPageComponent)
      },
      {
        path: 'how-it-works',
        title: 'Cara Kerja',
        loadComponent: () =>
          import('./features/public/how-it-works/how-it-works-page.component').then(m => m.HowItWorksPageComponent)
      },
      {
        path: 'insights',
        title: 'Artikel & Edukasi Hukum',
        loadComponent: () =>
          import('./features/public/insights/insights-page.component').then(m => m.InsightsPageComponent)
      },
      {
        path: 'insights/:slug',
        title: 'Detail Artikel Hukum',
        loadComponent: () =>
          import('./features/public/insights/article-detail-page.component').then(m => m.ArticleDetailPageComponent)
      },
      {
        path: 'about',
        title: 'Tentang Kami',
        loadComponent: () =>
          import('./features/public/about/about-page.component').then(m => m.AboutPageComponent)
      },
      {
        path: 'faq',
        title: 'FAQ - Pertanyaan yang Sering Diajukan',
        loadComponent: () =>
          import('./features/public/faq/faq-page.component').then(m => m.FaqPageComponent)
      },
      {
        path: 'contact',
        title: 'Hubungi Kami',
        loadComponent: () =>
          import('./features/public/contact/contact-page.component').then(m => m.ContactPageComponent)
      },
      {
        path: 'booking',
        title: 'Jadwalkan Konsultasi',
        loadComponent: () =>
          import('./features/public/booking/booking-page.component').then(m => m.BookingPageComponent)
      }
    ]
  },

  // ===== AUTHENTICATION =====
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        title: 'Masuk ke LegalConnect',
        loadComponent: () =>
          import('./features/public/auth/auth-page.component').then(m => m.AuthPageComponent)
      },
      {
        path: 'register',
        title: 'Daftar Akun LegalConnect',
        loadComponent: () =>
          import('./features/public/auth/auth-page.component').then(m => m.AuthPageComponent)
      },
      {
        path: 'forgot-password',
        title: 'Lupa Kata Sandi',
        loadComponent: () =>
          import('./features/public/auth/auth-page.component').then(m => m.AuthPageComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // ===== PORTAL (RBAC ENFORCED PORTALS) =====
  {
    path: 'portal',
    component: PortalLayoutComponent,
    children: [
      // 1. CUSTOMER PORTAL
      {
        path: 'customer',
        canActivate: [roleGuard([UserRole.CUSTOMER, UserRole.ADMIN])],
        children: [
          {
            path: 'dashboard',
            title: 'Portal Klien - Dashboard',
            loadComponent: () =>
              import('./features/portal/customer/customer-dashboard.component').then(m => m.CustomerDashboardComponent)
          },
          {
            path: 'bookings',
            title: 'Portal Klien - Booking Saya',
            loadComponent: () =>
              import('./features/portal/customer/customer-bookings.component').then(m => m.CustomerBookingsComponent)
          },
          {
            path: 'bookings/:id',
            title: 'Portal Klien - Detail Booking',
            loadComponent: () =>
              import('./features/portal/customer/customer-booking-detail.component').then(m => m.CustomerBookingDetailComponent)
          },
          {
            path: 'consultations',
            title: 'Portal Klien - Sesi Konsultasi',
            loadComponent: () =>
              import('./features/portal/customer/customer-consultations.component').then(m => m.CustomerConsultationsComponent)
          },
          {
            path: 'documents',
            title: 'Portal Klien - Dokumen Hukum',
            loadComponent: () =>
              import('./features/portal/customer/customer-documents.component').then(m => m.CustomerDocumentsComponent)
          },
          {
            path: 'payments',
            title: 'Portal Klien - Riwayat Pembayaran',
            loadComponent: () =>
              import('./features/portal/customer/customer-payments.component').then(m => m.CustomerPaymentsComponent)
          },
          {
            path: 'reviews',
            title: 'Portal Klien - Ulasan Saya',
            loadComponent: () =>
              import('./features/portal/customer/customer-reviews.component').then(m => m.CustomerReviewsComponent)
          },
          {
            path: 'notifications',
            title: 'Portal Klien - Notifikasi',
            loadComponent: () =>
              import('./features/portal/customer/customer-notifications.component').then(m => m.CustomerNotificationsComponent)
          },
          {
            path: 'profile',
            title: 'Portal Klien - Pengaturan Profil',
            loadComponent: () =>
              import('./features/portal/customer/customer-profile.component').then(m => m.CustomerProfileComponent)
          },
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          }
        ]
      },

      // 2. LEGAL PROFESSIONAL PORTAL
      {
        path: 'pro',
        canActivate: [roleGuard([UserRole.LEGAL_PRO, UserRole.ADMIN])],
        children: [
          {
            path: 'dashboard',
            title: 'Portal Advokat - Ringkasan Kinerja',
            loadComponent: () =>
              import('./features/portal/pro/pro-dashboard.component').then(m => m.ProDashboardComponent)
          },
          {
            path: 'schedule',
            title: 'Portal Advokat - Jadwal & Ketersediaan',
            loadComponent: () =>
              import('./features/portal/pro/pro-schedule.component').then(m => m.ProScheduleComponent)
          },
          {
            path: 'consultations',
            title: 'Portal Advokat - Konsultasi Klien',
            loadComponent: () =>
              import('./features/portal/pro/pro-consultations.component').then(m => m.ProConsultationsComponent)
          },
          {
            path: 'case-notes',
            title: 'Portal Advokat - Catatan Kasus',
            loadComponent: () =>
              import('./features/portal/pro/pro-case-notes.component').then(m => m.ProCaseNotesComponent)
          },
          {
            path: 'services',
            title: 'Portal Advokat - Layanan Hukum Saya',
            loadComponent: () =>
              import('./features/portal/pro/pro-services.component').then(m => m.ProServicesComponent)
          },
          {
            path: 'profile',
            title: 'Portal Advokat - Profil & Verifikasi',
            loadComponent: () =>
              import('./features/portal/pro/pro-profile.component').then(m => m.ProProfileComponent)
          },
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          }
        ]
      },

      // 3. ADMIN CMS PORTAL
      {
        path: 'admin',
        canActivate: [roleGuard([UserRole.ADMIN])],
        children: [
          {
            path: 'dashboard',
            title: 'Admin CMS - Ringkasan Platform',
            loadComponent: () =>
              import('./features/portal/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
          },
          {
            path: 'users',
            title: 'Admin CMS - Kelola Pengguna',
            loadComponent: () =>
              import('./features/portal/admin/admin-users.component').then(m => m.AdminUsersComponent)
          },
          {
            path: 'verifications',
            title: 'Admin CMS - Verifikasi Advokat',
            loadComponent: () =>
              import('./features/portal/admin/admin-verifications.component').then(m => m.AdminVerificationsComponent)
          },
          {
            path: 'content',
            title: 'Admin CMS - Kelola Konten',
            loadComponent: () =>
              import('./features/portal/admin/admin-content.component').then(m => m.AdminContentComponent)
          },
          {
            path: 'bookings',
            title: 'Admin CMS - Transaksi & Booking',
            loadComponent: () =>
              import('./features/portal/admin/admin-bookings.component').then(m => m.AdminBookingsComponent)
          },
          {
            path: 'settings',
            title: 'Admin CMS - Pengaturan Platform',
            loadComponent: () =>
              import('./features/portal/admin/admin-settings.component').then(m => m.AdminSettingsComponent)
          },
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          }
        ]
      },

      {
        path: '',
        redirectTo: 'customer',
        pathMatch: 'full'
      }
    ]
  },

  // ===== ERROR PAGES =====
  {
    path: 'error',
    children: [
      {
        path: 'server',
        title: 'Kesalahan Server',
        loadComponent: () =>
          import('./features/error/server-error/server-error-page.component').then(m => m.ServerErrorPageComponent)
      },
      {
        path: 'forbidden',
        title: 'Akses Ditolak',
        loadComponent: () =>
          import('./features/error/not-found/not-found-page.component').then(m => m.NotFoundPageComponent)
      }
    ]
  },

  // ===== WILDCARD =====
  {
    path: '**',
    title: 'Halaman Tidak Ditemukan',
    loadComponent: () =>
      import('./features/error/not-found/not-found-page.component').then(m => m.NotFoundPageComponent)
  }
];
