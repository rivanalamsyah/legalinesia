import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerBookingService } from '../../../core/services/customer-booking.service';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-customer-payments',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IconComponent,
    StatusBadgeComponent,
    PortalPageHeaderComponent,
    ButtonComponent
  ],
  template: `
    <div class="space-y-6">
      
      <!-- Page Header -->
      <app-portal-page-header
        categoryLabel="Portal Klien"
        title="Riwayat Pembayaran & Invoice"
        subtitle="Pantau bukti transaksi, status pembayaran, dan unduh kuitansi resmi konsultasi hukum."
        [breadcrumbs]="[{ label: 'Portal Klien', url: '/portal/customer' }, { label: 'Pembayaran' }]">
      </app-portal-page-header>

      <!-- Payments Table -->
      <div class="glass-panel rounded-2xl border border-navy-800 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-white/5 border-b border-navy-800 text-white/60 uppercase tracking-wider font-semibold">
              <tr>
                <th class="p-4">No. Transaction / Booking</th>
                <th class="p-4">Layanan & Advokat</th>
                <th class="p-4">Metode</th>
                <th class="p-4">Jumlah (Rp)</th>
                <th class="p-4">Status Pembayaran</th>
                <th class="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-navy-800/60 text-white/90">
              @for (item of bookingService.customerBookings(); track item.id) {
                <tr class="hover:bg-white/[0.02] transition-colors">
                  <td class="p-4 font-mono font-bold text-brand-400">#{{ item.id }}</td>
                  <td class="p-4">
                    <div class="font-semibold text-white">{{ item.serviceTitle }}</div>
                    <div class="text-[11px] text-white/50">{{ item.professionalName }}</div>
                  </td>
                  <td class="p-4 text-white/70">{{ item.paymentMethod || 'Bank Transfer (VA)' }}</td>
                  <td class="p-4 font-semibold text-amber-400">Rp {{ item.consultationFee | number:'1.0-0' }}</td>
                  <td class="p-4">
                    <span
                      class="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                      [ngClass]="item.paymentStatus === 'PAID' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'">
                      {{ item.paymentStatus === 'PAID' ? 'TERBAYAR' : 'MENUNGGU PEMBAYARAN' }}
                    </span>
                  </td>
                  <td class="p-4 text-right">
                    <a [routerLink]="['/portal/customer/bookings', item.id]">
                      <app-button variant="outline" size="sm">Rincian</app-button>
                    </a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class CustomerPaymentsComponent {
  public readonly bookingService = inject(CustomerBookingService);
}
