import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminCmsService } from '../../../core/services/admin-cms.service';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { KpiCardComponent } from '../../../shared/components/ui/kpi-card/kpi-card.component';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-admin-dashboard',
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
      
      <!-- Standardized Page Header -->
      <app-portal-page-header
        categoryLabel="Platform Management CMS"
        title="Ringkasan Operasional Legalinesia"
        subtitle="Pusat kendali pengguna platform, verifikasi lisensi advokat, transaksi booking, dan tata kelola master data secara real-time."
        [breadcrumbs]="[{ label: 'Admin CMS', url: '/portal/admin' }, { label: 'Ringkasan Platform' }]">
        
        <div class="flex items-center gap-2">
          <app-status-badge status="ACTIVE" label="PLATFORM OPERATIONAL"></app-status-badge>
          <a routerLink="/portal/admin/verifications">
            <app-button variant="gold" size="sm" iconLeft="badge-check">
              Review Verifikasi ({{ adminService.pendingVerificationsCount() }})
            </app-button>
          </a>
        </div>
      </app-portal-page-header>

      <!-- Operational Alert Banners (If there are pending verifications or payments) -->
      @if (adminService.pendingVerificationsCount() > 0 || adminService.pendingPaymentsCount() > 0) {
        <div class="space-y-3">
          @if (adminService.pendingVerificationsCount() > 0) {
            <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <app-icon name="alert-triangle" size="sm" class="text-amber-400 shrink-0"></app-icon>
                <span>Terdapat <strong>{{ adminService.pendingVerificationsCount() }} permohonan verifikasi advokat</strong> baru yang memerlukan pemeriksaan dokumen lisensi PERADI/KAI.</span>
              </div>
              <a routerLink="/portal/admin/verifications">
                <app-button variant="gold" size="xs">Tinjau Sekarang</app-button>
              </a>
            </div>
          }

          @if (adminService.pendingPaymentsCount() > 0) {
            <div class="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <app-icon name="credit-card" size="sm" class="text-brand-400 shrink-0"></app-icon>
                <span>Terdapat <strong>{{ adminService.pendingPaymentsCount() }} transaksi booking</strong> yang menunggu verifikasi pembayaran transfer manual.</span>
              </div>
              <a routerLink="/portal/admin/bookings">
                <app-button variant="primary" size="xs">Verifikasi Pembayaran</app-button>
              </a>
            </div>
          }
        </div>
      }

      <!-- Analytics KPI Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-kpi-card
          label="Total Pengguna Terdaftar"
          [value]="(adminService.customers().length + adminService.professionals().length) + ' Pengguna'"
          [changeText]="adminService.customers().length + ' Klien • ' + adminService.professionals().length + ' Advokat'"
          trend="up"
          iconName="users"
          iconVariant="primary">
        </app-kpi-card>

        <app-kpi-card
          label="Advokat Terverifikasi"
          [value]="verifiedProCount + ' Advokat'"
          [changeText]="adminService.pendingVerificationsCount() + ' Menunggu Verifikasi'"
          [trend]="adminService.pendingVerificationsCount() > 0 ? 'down' : 'up'"
          iconName="shield-check"
          iconVariant="warning">
        </app-kpi-card>

        <app-kpi-card
          label="Total Transaksi Booking"
          [value]="adminService.allBookings().length + ' Transaksi'"
          [changeText]="'Total Nilai: Rp ' + adminService.totalPlatformRevenue().toLocaleString('id-ID')"
          trend="up"
          iconName="receipt"
          iconVariant="success">
        </app-kpi-card>

        <app-kpi-card
          label="Master Taxonomi Praktik"
          [value]="adminService.practiceAreas().length + ' Kategori'"
          changeText="Katalog Hukum Aktif"
          trend="neutral"
          iconName="folder-git-2"
          iconVariant="purple">
        </app-kpi-card>
      </div>

      <!-- Quick Action Shortcuts -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3 hover:border-brand-500/40 transition-all">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <app-icon name="badge-check" size="sm"></app-icon>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-white font-heading">Verifikasi Lisensi Advokat</h3>
              <p class="text-xs text-white/50">Audit NIA PERADI / KAI</p>
            </div>
          </div>
          <p class="text-xs text-white/70 leading-relaxed pt-1">Verifikasi dokumen keanggotaan dan sertifikat advokat sebelum dipublikasikan di direktori.</p>
          <a routerLink="/portal/admin/verifications" class="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold hover:underline pt-2">
            <span>Buka Antrean Verifikasi</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3 hover:border-brand-500/40 transition-all">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <app-icon name="users" size="sm"></app-icon>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-white font-heading">Kelola Pengguna Platform</h3>
              <p class="text-xs text-white/50">Klien & Legal Pro</p>
            </div>
          </div>
          <p class="text-xs text-white/70 leading-relaxed pt-1">Tinjau hak akses RBAC, status keaktifan akun, dan direktori pengguna terdaftar.</p>
          <a routerLink="/portal/admin/users" class="inline-flex items-center gap-1.5 text-xs text-brand-400 font-semibold hover:underline pt-2">
            <span>Lihat Direktori Pengguna</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3 hover:border-brand-500/40 transition-all">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <app-icon name="folder-git-2" size="sm"></app-icon>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-white font-heading">Master Data & CMS</h3>
              <p class="text-xs text-white/50">Taxonomi & Layanan</p>
            </div>
          </div>
          <p class="text-xs text-white/70 leading-relaxed pt-1">Atur kategori bidang hukum, paket layanan publik, artikel legal insight, dan FAQ.</p>
          <a routerLink="/portal/admin/content" class="inline-flex items-center gap-1.5 text-xs text-purple-400 font-semibold hover:underline pt-2">
            <span>Kelola CMS Master</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>
      </div>

      <!-- Platform Recent Bookings & Audit Trail Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Table: Transaksi Terbaru (2 cols) -->
        <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
          <div class="flex items-center justify-between border-b border-navy-800 pb-3">
            <h3 class="text-base font-semibold text-white font-heading flex items-center gap-2">
              <app-icon name="receipt" size="sm" class="text-emerald-400"></app-icon>
              <span>Transaksi Booking Terbaru</span>
            </h3>
            <a routerLink="/portal/admin/bookings" class="text-xs text-brand-400 font-medium hover:underline flex items-center gap-1">
              <span>Semua Transaksi</span>
              <app-icon name="arrow-right" size="xs"></app-icon>
            </a>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-navy-950/80 text-white/60 uppercase font-mono border-b border-navy-800">
                <tr>
                  <th class="p-3">ID Booking</th>
                  <th class="p-3">Klien</th>
                  <th class="p-3">Advokat</th>
                  <th class="p-3">Layanan</th>
                  <th class="p-3">Status</th>
                  <th class="p-3">Tarif</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-navy-800/80 text-white">
                @for (b of adminService.allBookings(); track b.id) {
                  <tr class="hover:bg-navy-900/50 transition-colors">
                    <td class="p-3 font-mono font-bold text-brand-400">{{ b.id }}</td>
                    <td class="p-3 font-semibold">{{ b.customerName }}</td>
                    <td class="p-3 text-white/80">{{ b.professionalName }}</td>
                    <td class="p-3 text-white/70 max-w-[150px] truncate">{{ b.serviceTitle }}</td>
                    <td class="p-3"><app-status-badge [status]="b.status"></app-status-badge></td>
                    <td class="p-3 font-semibold text-emerald-400 font-mono">Rp {{ b.consultationFee.toLocaleString('id-ID') }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Audit Trail Log (1 col) -->
        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
          <div class="border-b border-navy-800 pb-3">
            <h3 class="text-base font-semibold text-white font-heading flex items-center gap-2">
              <app-icon name="clock" size="sm" class="text-purple-400"></app-icon>
              <span>System Audit Trail</span>
            </h3>
            <p class="text-xs text-white/50 mt-0.5">Catatan aktivitas operasional admin</p>
          </div>

          <div class="space-y-3">
            @for (log of adminService.auditLogs(); track log.id) {
              <div class="p-3 rounded-xl bg-navy-950/70 border border-navy-800 space-y-1 text-xs">
                <div class="flex items-center justify-between">
                  <span class="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300">
                    {{ log.action }}
                  </span>
                  <span class="text-white/40 font-mono text-[10px]">{{ log.timestamp }}</span>
                </div>
                <div class="text-white/90 font-medium">{{ log.target }}</div>
                <div class="text-[11px] text-white/50 font-mono">Aktor: {{ log.actorEmail }}</div>
              </div>
            }
          </div>
        </div>

      </div>

    </div>
  `
})
export class AdminDashboardComponent {
  public readonly adminService = inject(AdminCmsService);

  public get verifiedProCount(): number {
    return this.adminService.professionals().filter(p => p.isVerified).length;
  }
}
