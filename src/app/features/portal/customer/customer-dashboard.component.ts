import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { UserProfile } from '../../../core/models/user.model';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { KpiCardComponent } from '../../../shared/components/ui/kpi-card/kpi-card.component';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IconComponent,
    KpiCardComponent,
    StatusBadgeComponent,
    PortalPageHeaderComponent,
    ButtonComponent
  ],
  template: `
    <div class="space-y-8">
      
      <!-- Standardized Portal Page Header -->
      <app-portal-page-header
        categoryLabel="Portal Klien"
        [title]="'Selamat Datang, ' + (user?.fullName || 'Klien LegalConnect')"
        subtitle="Kelola sesi konsultasi hukum, lacak dokumen permohonan, dan jadwalkan pertemuan dengan advokat terverifikasi."
        [breadcrumbs]="[{ label: 'Portal Klien', url: '/portal/customer' }, { label: 'Ringkasan' }]">
        
        <a routerLink="/booking">
          <app-button variant="primary" size="md" iconLeft="calendar-plus">
            Jadwalkan Konsultasi
          </app-button>
        </a>
      </app-portal-page-header>

      <!-- KPI Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-kpi-card
          label="Konsultasi Aktif"
          value="1 Sesi"
          changeText="Mendatang minggu ini"
          trend="up"
          iconName="calendar"
          iconVariant="primary">
        </app-kpi-card>

        <app-kpi-card
          label="Total Konsultasi"
          value="4 Sesi"
          changeText="3 sesi telah selesai"
          trend="neutral"
          iconName="check-circle-2"
          iconVariant="success">
        </app-kpi-card>

        <app-kpi-card
          label="Dokumen Hukum Vault"
          value="6 Berkas"
          changeText="Akta, NIB, & Kontrak"
          trend="neutral"
          iconName="file-text"
          iconVariant="warning">
        </app-kpi-card>

        <app-kpi-card
          label="Status Verifikasi Akun"
          value="Aktif"
          changeText="Identitas KTP Terkonfirmasi"
          trend="up"
          iconName="shield-check"
          iconVariant="gold">
        </app-kpi-card>
      </div>

      <!-- Upcoming Session & Guides -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Active Session Card -->
        <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-semibold text-white font-heading flex items-center gap-2">
              <app-icon name="clock" size="sm" className="text-brand-400"></app-icon>
              <span>Jadwal Konsultasi Mendatang</span>
            </h2>
            <a routerLink="/portal/customer/consultations" class="text-xs text-brand-400 hover:underline">Lihat Semua</a>
          </div>

          <div class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-brand-900 border border-brand-500/30 flex items-center justify-center font-bold text-brand-300">
                  BS
                </div>
                <div>
                  <div class="text-sm font-semibold text-white">Bambang Sutrisno, S.H., M.H.</div>
                  <div class="text-xs text-white/60">Advokat Senior Hukum Bisnis</div>
                </div>
              </div>
              <app-status-badge status="CONFIRMED"></app-status-badge>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs text-white/70">
              <div class="flex items-center gap-2">
                <app-icon name="calendar" size="xs" className="text-brand-400"></app-icon>
                <span>Senin, 6 Oktober 2026</span>
              </div>
              <div class="flex items-center gap-2">
                <app-icon name="video" size="xs" className="text-brand-400"></app-icon>
                <span>Sesi Online Video (Google Meet)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Guide Panel -->
        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
          <h2 class="text-base font-semibold text-white font-heading">Vault & Panduan Klien</h2>
          <p class="text-xs text-white/60 leading-relaxed">
            Gunakan portal ini untuk mengakses catatan hasil konsultasi, berkomunikasi secara aman dengan advokat Anda, serta mengunggah berkas hukum yang diperlukan.
          </p>
          <div class="pt-2">
            <a routerLink="/portal/customer/documents" class="text-xs text-brand-400 font-semibold hover:underline flex items-center gap-1">
              <span>Kelola Berkas Hukum Saya</span>
              <app-icon name="chevron-right" size="xs"></app-icon>
            </a>
          </div>
        </div>

      </div>

    </div>
  `
})
export class CustomerDashboardComponent {
  private readonly authState = inject(AuthStateService);
  public get user(): UserProfile | null { return this.authState.currentUser(); }
}
