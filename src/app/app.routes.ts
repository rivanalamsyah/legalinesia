import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';

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
