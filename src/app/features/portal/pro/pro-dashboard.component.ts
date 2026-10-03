import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { UserProfile } from '../../../core/models/user.model';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { KpiCardComponent } from '../../../shared/components/ui/kpi-card/kpi-card.component';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';

@Component({
  selector: 'app-pro-dashboard',
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
        categoryLabel="Portal Advokat & Partner"
        [title]="'Selamat Datang, ' + (user?.fullName || 'Advokat LegalConnect')"
        subtitle="Kelola jadwal ketersediaan konsultasi, tinjau permintaan klien, buat catatan kasus hukum, dan atur katalog layanan Anda."
        [breadcrumbs]="[{ label: 'Portal Advokat', url: '/portal/pro' }, { label: 'Ringkasan Kinerja' }]">
        
        <app-status-badge status="VERIFIED" label="VERIFIED ADVOKAT"></app-status-badge>
      </app-portal-page-header>

      <!-- KPI Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-kpi-card
          label="Sesi Hari Ini"
          value="3 Sesi"
          changeText="Terjadwal 14:00 - 17:00"
          trend="up"
          iconName="calendar-check"
          iconVariant="primary">
        </app-kpi-card>

        <app-kpi-card
          label="Total Klien Ditangani"
          value="128 Klien"
          changeText="Rating 4.9 / 5.0"
          trend="up"
          iconName="users"
          iconVariant="success">
        </app-kpi-card>

        <app-kpi-card
          label="Catatan Kasus Selesai"
          value="94 Berkas"
          changeText="Telah dibagikan ke klien"
          trend="neutral"
          iconName="notebook-pen"
          iconVariant="purple">
        </app-kpi-card>

        <app-kpi-card
          label="Tarif Konsultasi Sesi"
          value="Rp 350.000"
          changeText="Per jam / sesi"
          trend="neutral"
          iconName="briefcase"
          iconVariant="gold">
        </app-kpi-card>
      </div>

      <!-- Quick Actions Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3">
          <h3 class="text-base font-semibold text-white font-heading">Atur Jadwal & Ketersediaan</h3>
          <p class="text-xs text-white/60 leading-relaxed">Tentukan slot jam dan hari kerja tempat klien dapat melakukan booking.</p>
          <a routerLink="/portal/pro/schedule" class="inline-flex items-center gap-1.5 text-xs text-brand-400 font-semibold hover:underline pt-2">
            <span>Kelola Jadwal Ketersediaan</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3">
          <h3 class="text-base font-semibold text-white font-heading">Tulis Catatan Konsultasi</h3>
          <p class="text-xs text-white/60 leading-relaxed">Dokumentasikan ringkasan nasihat hukum dan langkah selanjutnya pasca sesi.</p>
          <a routerLink="/portal/pro/case-notes" class="inline-flex items-center gap-1.5 text-xs text-brand-400 font-semibold hover:underline pt-2">
            <span>Buat Catatan Baru</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3">
          <h3 class="text-base font-semibold text-white font-heading">Kelola Layanan Hukum</h3>
          <p class="text-xs text-white/60 leading-relaxed">Perbarui rincian spesialisasi, cakupan layanan, dan tarif konsultasi Anda.</p>
          <a routerLink="/portal/pro/services" class="inline-flex items-center gap-1.5 text-xs text-brand-400 font-semibold hover:underline pt-2">
            <span>Sunting Katalog Layanan</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>
      </div>

    </div>
  `
})
export class ProDashboardComponent {
  private readonly authState = inject(AuthStateService);
  public get user(): UserProfile | null { return this.authState.currentUser(); }
}
