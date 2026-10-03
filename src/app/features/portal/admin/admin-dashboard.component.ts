import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { KpiCardComponent } from '../../../shared/components/ui/kpi-card/kpi-card.component';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IconComponent,
    KpiCardComponent,
    StatusBadgeComponent,
    PortalPageHeaderComponent
  ],
  template: `
    <div class="space-y-8">
      
      <!-- Standardized Page Header -->
      <app-portal-page-header
        categoryLabel="Platform Management CMS"
        title="Ringkasan Operasional LegalConnect"
        subtitle="Pantau pertumbuhan pengguna, verifikasi lisensi advokat, kontrol katalog layanan, dan transaksi platform secara real-time."
        [breadcrumbs]="[{ label: 'Admin CMS', url: '/portal/admin' }, { label: 'Ringkasan Platform' }]">
        
        <app-status-badge status="ACTIVE" label="SYSTEM ONLINE"></app-status-badge>
      </app-portal-page-header>

      <!-- Analytics KPI Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-kpi-card
          label="Total Pengguna Platform"
          value="1,420"
          changeText="+12% bulan ini"
          trend="up"
          iconName="users"
          iconVariant="primary">
        </app-kpi-card>

        <app-kpi-card
          label="Advokat Terverifikasi"
          value="86"
          changeText="3 Perlu Verifikasi"
          trend="neutral"
          iconName="shield-check"
          iconVariant="warning">
        </app-kpi-card>

        <app-kpi-card
          label="Total Transaksi Selesai"
          value="340"
          changeText="Oktober 2026"
          trend="up"
          iconName="receipt"
          iconVariant="success">
        </app-kpi-card>

        <app-kpi-card
          label="Artikel CMS Published"
          value="24"
          changeText="Legal Insight SEO"
          trend="neutral"
          iconName="folder-git-2"
          iconVariant="purple">
        </app-kpi-card>
      </div>

      <!-- Operations Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3">
          <h3 class="text-base font-semibold text-white font-heading">Antrean Verifikasi Advokat</h3>
          <p class="text-xs text-white/60 leading-relaxed">Periksa kelengkapan KTP, Sertifikat PERADI/KAI, dan foto profil advokat baru.</p>
          <a routerLink="/portal/admin/verifications" class="inline-flex items-center gap-1.5 text-xs text-brand-400 font-semibold hover:underline pt-2">
            <span>Tinjau Verifikasi (3)</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3">
          <h3 class="text-base font-semibold text-white font-heading">Manajemen Pengguna Platform</h3>
          <p class="text-xs text-white/60 leading-relaxed">Kelola role pengguna (Klien, Legal Pro, Admin), suspek akun, dan hak akses RBAC.</p>
          <a routerLink="/portal/admin/users" class="inline-flex items-center gap-1.5 text-xs text-brand-400 font-semibold hover:underline pt-2">
            <span>Buka Tabel Pengguna</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3">
          <h3 class="text-base font-semibold text-white font-heading">Kelola Konten & CMS</h3>
          <p class="text-xs text-white/60 leading-relaxed">Sunting katalog layanan hukum publik, artikel edukasi, dan FAQ platform.</p>
          <a routerLink="/portal/admin/content" class="inline-flex items-center gap-1.5 text-xs text-brand-400 font-semibold hover:underline pt-2">
            <span>Kelola CMS</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>
      </div>

    </div>
  `
})
export class AdminDashboardComponent {}
