import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';

@Component({
  selector: 'app-customer-notifications',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    PortalPageHeaderComponent
  ],
  template: `
    <div class="space-y-6">
      
      <!-- Page Header -->
      <app-portal-page-header
        categoryLabel="Portal Klien"
        title="Notifikasi & Pemberitahuan"
        subtitle="Daftar notifikasi aktivitas booking, verifikasi pembayaran, dan pengingat jadwal konsultasi Anda."
        [breadcrumbs]="[{ label: 'Portal Klien', url: '/portal/customer' }, { label: 'Notifikasi' }]">
      </app-portal-page-header>

      <!-- Notifications List -->
      <div class="space-y-3">
        <div class="glass-panel p-4 rounded-2xl border border-navy-800 flex items-start gap-3">
          <div class="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
            <app-icon name="calendar-check" size="sm"></app-icon>
          </div>
          <div class="space-y-0.5">
            <div class="text-xs font-semibold text-white">Jadwal Konsultasi Dikonfirmasi (#BK-202610-001)</div>
            <p class="text-xs text-white/60">Advokat Bambang Sutrisno menyetujui sesi video call pada Senin, 6 Okt 2026 jam 14:00 WIB.</p>
            <span class="text-[10px] text-white/40 block pt-1">2 Jam lalu</span>
          </div>
        </div>

        <div class="glass-panel p-4 rounded-2xl border border-navy-800 flex items-start gap-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <app-icon name="credit-card" size="sm"></app-icon>
          </div>
          <div class="space-y-0.5">
            <div class="text-xs font-semibold text-white">Pembayaran Rp 350.000 Terverifikasi</div>
            <p class="text-xs text-white/60">Pembayaran kuitansi via BCA Virtual Account telah berhasil diverifikasi oleh sistem.</p>
            <span class="text-[10px] text-white/40 block pt-1">Kemarin</span>
          </div>
        </div>
      </div>

    </div>
  `
})
export class CustomerNotificationsComponent {}
