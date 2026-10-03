import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCmsService } from '../../../core/services/admin-cms.service';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { ConfirmationDialogComponent } from '../../../shared/components/ui/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PortalPageHeaderComponent,
    StatusBadgeComponent,
    ButtonComponent,
    IconComponent,
    ConfirmationDialogComponent
  ],
  template: `
    <div class="space-y-8">
      <!-- Page Header -->
      <app-portal-page-header
        categoryLabel="Platform Operations"
        title="Transaksi & Booking Platform"
        subtitle="Pengawasan seluruh transaksi pemesanan konsultasi, status pembayaran, serta verifikasi bukti transfer manual."
        [breadcrumbs]="[{ label: 'Admin CMS', url: '/portal/admin' }, { label: 'Transaksi & Booking' }]">
        
        <div class="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg font-mono font-bold">
          Total Nilai Transaksi: Rp {{ adminService.totalPlatformRevenue().toLocaleString('id-ID') }}
        </div>
      </app-portal-page-header>

      <!-- Filter Controls -->
      <div class="glass-panel p-4 rounded-2xl border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Search input -->
        <div class="relative flex-1 max-w-md">
          <app-icon name="search" size="xs" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"></app-icon>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Cari ID booking, nama klien, atau nama advokat..."
            class="w-full bg-navy-950/80 border border-navy-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-brand-500"
          />
        </div>

        <!-- Status Filter Tabs -->
        <div class="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0">
          @for (tab of statusTabs; track tab.value) {
            <button
              (click)="selectedStatusFilter.set(tab.value)"
              [class]="selectedStatusFilter() === tab.value
                ? 'px-3 py-1.5 rounded-lg bg-brand-500 text-white font-semibold text-xs transition-all shadow-sm'
                : 'px-3 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-navy-800/60 font-medium text-xs transition-all'"
            >
              {{ tab.label }}
            </button>
          }
        </div>
      </div>

      <!-- Bookings Table -->
      @if (filteredBookings().length > 0) {
        <div class="glass-panel rounded-2xl border border-navy-800 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-navy-950/80 border-b border-navy-800 text-white/60 uppercase font-mono">
                <tr>
                  <th class="p-3.5">ID Booking</th>
                  <th class="p-3.5">Klien</th>
                  <th class="p-3.5">Advokat Assigned</th>
                  <th class="p-3.5">Layanan Hukum</th>
                  <th class="p-3.5">Status Booking</th>
                  <th class="p-3.5">Status Pembayaran</th>
                  <th class="p-3.5">Tarif</th>
                  <th class="p-3.5 text-right">Aksi Manual</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-navy-800/80 text-white">
                @for (b of filteredBookings(); track b.id) {
                  <tr class="hover:bg-navy-900/50 transition-colors">
                    <td class="p-3.5 font-mono font-bold text-brand-400">{{ b.id }}</td>
                    <td class="p-3.5">
                      <div class="font-semibold text-white">{{ b.customerName }}</div>
                      <div class="text-white/50 font-mono text-[11px]">{{ b.customerEmail }}</div>
                    </td>
                    <td class="p-3.5 font-semibold text-white/90">{{ b.professionalName }}</td>
                    <td class="p-3.5 text-white/70 max-w-[160px] truncate">{{ b.serviceTitle }}</td>
                    <td class="p-3.5"><app-status-badge [status]="b.status"></app-status-badge></td>
                    <td class="p-3.5">
                      <span
                        class="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
                        [class]="b.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'"
                      >
                        {{ b.paymentStatus }}
                      </span>
                    </td>
                    <td class="p-3.5 font-semibold text-emerald-400 font-mono">Rp {{ b.consultationFee.toLocaleString('id-ID') }}</td>
                    <td class="p-3.5 text-right">
                      @if (b.paymentStatus !== 'PAID') {
                        <app-button variant="primary" size="xs" iconLeft="check-circle" (click)="confirmVerifyPayment(b.id)">
                          Verifikasi Bayar
                        </app-button>
                      } @else {
                        <span class="text-white/40 text-[11px]">Terverifikasi</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      } @else {
        <div class="glass-panel p-12 text-center rounded-2xl border border-navy-800 space-y-3">
          <div class="w-14 h-14 rounded-full bg-navy-800 text-white/40 flex items-center justify-center mx-auto">
            <app-icon name="receipt" size="lg"></app-icon>
          </div>
          <h3 class="text-base font-semibold text-white">Tidak ada transaksi yang ditemukan</h3>
          <p class="text-xs text-white/50 max-w-sm mx-auto">Tidak ada booking yang sesuai dengan kriteria pencarian atau status filter.</p>
        </div>
      }

      <!-- Verify Payment Confirmation Dialog -->
      <app-confirmation-dialog
        [isOpen]="selectedBookingForPayment !== null"
        title="Verifikasi Pembayaran Manual?"
        message="Apakah Anda telah memeriksa bukti transfer pembayaran untuk booking ini? Status pembayaran akan diubah menjadi PAID dan status booking akan dikonfirmasi."
        confirmText="Konfirmasi Terbayar"
        variant="info"
        (confirm)="onConfirmVerifyPayment()"
        (cancel)="selectedBookingForPayment = null">
      </app-confirmation-dialog>

    </div>
  `
})
export class AdminBookingsComponent {
  public readonly adminService = inject(AdminCmsService);

  public searchQuery = '';
  public selectedStatusFilter = signal<string>('ALL');
  public selectedBookingForPayment: string | null = null;

  public readonly statusTabs = [
    { label: 'Semua Transaksi', value: 'ALL' },
    { label: 'Menunggu Pembayaran', value: 'WAITING_PAYMENT' },
    { label: 'Dikonfirmasi', value: 'CONFIRMED' },
    { label: 'Selesai', value: 'COMPLETED' }
  ];

  public readonly filteredBookings = computed(() => {
    let list = this.adminService.allBookings();
    const status = this.selectedStatusFilter();
    const q = this.searchQuery.toLowerCase().trim();

    if (status !== 'ALL') {
      list = list.filter(b => b.status === status);
    }

    if (q) {
      list = list.filter(b =>
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.professionalName.toLowerCase().includes(q) ||
        b.serviceTitle.toLowerCase().includes(q)
      );
    }

    return list;
  });

  public confirmVerifyPayment(bookingId: string): void {
    this.selectedBookingForPayment = bookingId;
  }

  public onConfirmVerifyPayment(): void {
    if (this.selectedBookingForPayment) {
      this.adminService.verifyBookingPayment(this.selectedBookingForPayment);
      this.selectedBookingForPayment = null;
    }
  }
}
