import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCmsService, AdminReview } from '../../../core/services/admin-cms.service';
import { BookingItem } from '../../../core/models/booking.model';
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
        title="Operasi Transaksi, Ulasan & Notifikasi"
        subtitle="Pengawasan transaksi booking platform, verifikasi bukti transfer manual, moderasi ulasan publik, dan pengiriman notifikasi siaran."
        [breadcrumbs]="[{ label: 'Admin CMS', url: '/portal/admin' }, { label: 'Operasi Platform' }]">
        
        <div class="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg font-mono font-bold">
          Total Pendapatan Platform: Rp {{ adminService.totalPlatformRevenue().toLocaleString('id-ID') }}
        </div>
      </app-portal-page-header>

      <!-- Operational Sub-Tabs -->
      <div class="flex items-center gap-2 border-b border-navy-800 pb-3">
        <button
          (click)="activeSubTab.set('BOOKINGS')"
          [class]="activeSubTab() === 'BOOKINGS'
            ? 'px-4 py-2 rounded-xl bg-brand-500 text-white font-semibold text-xs transition-all shadow-sm'
            : 'px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-navy-800 font-medium text-xs transition-all'"
        >
          Transaksi & Booking ({{ adminService.allBookings().length }})
        </button>

        <button
          (click)="activeSubTab.set('REVIEWS')"
          [class]="activeSubTab() === 'REVIEWS'
            ? 'px-4 py-2 rounded-xl bg-brand-500 text-white font-semibold text-xs transition-all shadow-sm'
            : 'px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-navy-800 font-medium text-xs transition-all'"
        >
          Moderasi Ulasan ({{ adminService.reviews().length }})
        </button>

        <button
          (click)="activeSubTab.set('NOTIFICATIONS')"
          [class]="activeSubTab() === 'NOTIFICATIONS'
            ? 'px-4 py-2 rounded-xl bg-brand-500 text-white font-semibold text-xs transition-all shadow-sm'
            : 'px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-navy-800 font-medium text-xs transition-all'"
        >
          Notifikasi Siaran Platform ({{ adminService.notifications().length }})
        </button>
      </div>

      <!-- Tab 1: Bookings & Payments -->
      @if (activeSubTab() === 'BOOKINGS') {
        <div class="space-y-6">
          <!-- Filter Controls -->
          <div class="glass-panel p-4 rounded-2xl border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="relative flex-1 max-w-md">
              <app-icon name="search" size="xs" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"></app-icon>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                placeholder="Cari ID booking, nama klien, atau nama advokat..."
                class="w-full bg-navy-950/80 border border-navy-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-brand-500"
              />
            </div>

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
                        <td class="p-3.5 font-mono font-bold text-brand-400">
                          <button (click)="inspectBooking.set(b)" class="hover:underline text-left">
                            {{ b.id }}
                          </button>
                        </td>
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
                        <td class="p-3.5 text-right space-x-1">
                          @if (b.paymentStatus !== 'PAID') {
                            <app-button variant="primary" size="xs" iconLeft="check-circle" (click)="confirmVerifyPayment(b.id)">
                              Verifikasi Bayar
                            </app-button>
                          }
                          <app-button variant="outline" size="xs" iconLeft="eye" (click)="inspectBooking.set(b)">
                            Inspeksi
                          </app-button>
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
        </div>
      }

      <!-- Tab 2: Reviews Moderation -->
      @if (activeSubTab() === 'REVIEWS') {
        <div class="space-y-4">
          @for (rev of adminService.reviews(); track rev.id) {
            <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
              <div class="flex items-center justify-between border-b border-navy-800 pb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-brand-500/20 text-brand-300 font-bold flex items-center justify-center text-sm">
                    {{ rev.clientName.charAt(0) }}
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-white">{{ rev.clientName }} → {{ rev.professionalName }}</div>
                    <div class="text-xs text-white/50 font-mono">Booking ID: {{ rev.bookingId }} • Layanan: {{ rev.serviceTitle }}</div>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <span
                    class="text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase"
                    [class]="rev.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : rev.status === 'FLAGGED' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'"
                  >
                    {{ rev.status }}
                  </span>
                </div>
              </div>

              <p class="text-xs text-white/80 leading-relaxed italic">"{{ rev.comment }}"</p>

              <div class="pt-2 flex items-center justify-end gap-2 border-t border-navy-800">
                @if (rev.status !== 'PUBLISHED') {
                  <app-button variant="primary" size="xs" iconLeft="check" (click)="onModerate(rev.id, 'PUBLISHED')">Terbitkan Ulasan</app-button>
                }
                @if (rev.status !== 'FLAGGED') {
                  <app-button variant="outline" size="xs" iconLeft="flag" (click)="onModerate(rev.id, 'FLAGGED')">Tandai Flagged</app-button>
                }
                @if (rev.status !== 'HIDDEN') {
                  <app-button variant="danger" size="xs" iconLeft="eye-off" (click)="onModerate(rev.id, 'HIDDEN')">Sembunyikan Ulasan</app-button>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- Tab 3: System Broadcast Notifications -->
      @if (activeSubTab() === 'NOTIFICATIONS') {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Dispatch Form (1 col) -->
          <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
            <h3 class="text-base font-semibold text-white font-heading flex items-center gap-2">
              <app-icon name="bell" size="sm" class="text-gold-400"></app-icon>
              <span>Kirim Notifikasi Siaran</span>
            </h3>

            <div class="space-y-3 text-xs">
              <div>
                <label class="block text-white/60 mb-1">Target Peranan Pengguna</label>
                <select [(ngModel)]="notifTargetRole" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white">
                  <option value="ALL">Semua Pengguna (Klien & Advokat)</option>
                  <option value="CUSTOMER">Khusus Klien Terdaftar</option>
                  <option value="LEGAL_PRO">Khusus Legal Professional</option>
                </select>
              </div>

              <div>
                <label class="block text-white/60 mb-1">Judul Pengumuman</label>
                <input type="text" [(ngModel)]="notifTitle" placeholder="Misal: Pembaruan Kebijakan Platform" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white" />
              </div>

              <div>
                <label class="block text-white/60 mb-1">Isi Pesan Notifikasi</label>
                <textarea [(ngModel)]="notifMessage" rows="4" placeholder="Tuliskan isi pengumuman siaran resmi..." class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white"></textarea>
              </div>

              <app-button variant="gold" size="sm" class="w-full" iconLeft="send" (click)="onDispatchNotif()">
                Kirim Siaran Sekarang
              </app-button>
            </div>
          </div>

          <!-- Broadcast History List (2 cols) -->
          <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
            <h3 class="text-base font-semibold text-white font-heading">Riwayat Pengumuman Siaran</h3>

            <div class="space-y-3">
              @for (notif of adminService.notifications(); track notif.id) {
                <div class="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-mono font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded">
                      Target: {{ notif.targetRole }} ({{ notif.recipientCount }} Penerima)
                    </span>
                    <span class="text-xs text-white/40 font-mono">{{ notif.sentAt }}</span>
                  </div>
                  <h4 class="text-sm font-semibold text-white">{{ notif.title }}</h4>
                  <p class="text-xs text-white/70 leading-relaxed">{{ notif.message }}</p>
                </div>
              }
            </div>
          </div>

        </div>
      }

      <!-- Booking Detailed Inspector Modal -->
      @if (inspectBooking()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="glass-panel w-full max-w-2xl p-6 rounded-2xl border border-navy-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between border-b border-navy-800 pb-3">
              <div>
                <span class="text-xs font-mono text-brand-400 font-bold">{{ inspectBooking()?.id }}</span>
                <h3 class="text-base font-semibold text-white font-heading">{{ inspectBooking()?.serviceTitle }}</h3>
              </div>
              <button (click)="inspectBooking.set(null)" class="text-white/40 hover:text-white">
                <app-icon name="x" size="sm"></app-icon>
              </button>
            </div>

            <div class="space-y-4 text-xs">
              <div class="grid grid-cols-2 gap-4 bg-navy-950/80 p-3 rounded-xl border border-navy-800">
                <div>Klien: <strong class="text-white">{{ inspectBooking()?.customerName }}</strong> ({{ inspectBooking()?.customerEmail }})</div>
                <div>Advokat: <strong class="text-brand-300">{{ inspectBooking()?.professionalName }}</strong></div>
              </div>

              <div>
                <h5 class="text-white/50 uppercase font-semibold text-[10px] tracking-wider">Uraian Masalah Hukum</h5>
                <p class="text-white/90 leading-relaxed mt-1 whitespace-pre-line bg-navy-900/60 p-3 rounded-xl border border-navy-800/60">
                  {{ inspectBooking()?.problemDescription }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>Jadwal: <span class="text-gold-400 font-semibold">{{ inspectBooking()?.selectedDate }} ({{ inspectBooking()?.selectedTimeSlot }})</span></div>
                <div>Honorarium: <span class="text-emerald-400 font-bold">Rp {{ inspectBooking()?.consultationFee?.toLocaleString('id-ID') }}</span></div>
              </div>
            </div>

            <div class="pt-3 border-t border-navy-800 flex justify-end">
              <app-button variant="outline" size="sm" (click)="inspectBooking.set(null)">Tutup Inspector</app-button>
            </div>
          </div>
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

  public activeSubTab = signal<'BOOKINGS' | 'REVIEWS' | 'NOTIFICATIONS'>('BOOKINGS');
  public searchQuery = '';
  public selectedStatusFilter = signal<string>('ALL');
  public selectedBookingForPayment: string | null = null;
  public inspectBooking = signal<BookingItem | null>(null);

  public notifTitle = '';
  public notifMessage = '';
  public notifTargetRole: 'ALL' | 'CUSTOMER' | 'LEGAL_PRO' = 'ALL';

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

  public onModerate(reviewId: string, status: 'PUBLISHED' | 'FLAGGED' | 'HIDDEN'): void {
    this.adminService.moderateReview(reviewId, status);
  }

  public onDispatchNotif(): void {
    if (!this.notifTitle || !this.notifMessage) return;
    this.adminService.dispatchBroadcastNotification(this.notifTitle, this.notifMessage, this.notifTargetRole);
    this.notifTitle = '';
    this.notifMessage = '';
  }
}
