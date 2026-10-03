import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerPaymentService } from '../../../core/services/customer-payment.service';
import { NotificationService } from '../../../core/services/notification.service';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ToastComponent } from '../../../shared/components/ui/toast/toast.component';

@Component({
  selector: 'app-customer-payments',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IconComponent,
    PortalPageHeaderComponent,
    ButtonComponent,
    ToastComponent
  ],
  template: `
    <div class="space-y-6">
      
      <!-- Page Header -->
      <app-portal-page-header
        categoryLabel="Portal Klien"
        title="Riwayat Pembayaran & Virtual Account"
        subtitle="Instruksi transfer pembayaran manual, nomor virtual account, serta konfirmasi status verifikasi invoice Anda."
        [breadcrumbs]="[{ label: 'Portal Klien', url: '/portal/customer' }, { label: 'Pembayaran' }]">
      </app-portal-page-header>

      <!-- Active Pending Payments Banner (Manual VA Transfer UX) -->
      @if (paymentService.pendingPayments().length > 0) {
        <div class="glass-panel p-6 rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 space-y-4">
          <div class="flex items-center gap-3 text-amber-300 font-semibold text-sm">
            <app-icon name="alert-circle" size="sm" className="animate-pulse"></app-icon>
            <span>Tagihan Menunggu Pembayaran Transfer Manual</span>
          </div>

          @for (trx of paymentService.pendingPayments(); track trx.id) {
            <div class="p-4 rounded-xl bg-navy-900/90 border border-navy-700 space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-800 pb-2">
                <div>
                  <div class="text-xs font-bold text-white">{{ trx.serviceTitle }}</div>
                  <div class="text-[11px] text-white/50">Advokat: {{ trx.professionalName }}</div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-white/50">Total Tagihan:</div>
                  <div class="text-base font-bold text-amber-400 font-heading">Rp {{ trx.amount | number:'1.0-0' }}</div>
                </div>
              </div>

              <!-- Virtual Account Copy Box -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-white/5 border border-white/10 text-xs">
                <div class="space-y-0.5">
                  <span class="text-white/50 block text-[10px]">Nomor Virtual Account (BCA/Mandiri):</span>
                  <span class="font-mono font-bold text-sm text-brand-300 tracking-wider">{{ trx.virtualAccountNumber }}</span>
                </div>
                <button
                  type="button"
                  (click)="copyVaNumber(trx.virtualAccountNumber)"
                  class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto">
                  <app-icon name="copy" size="xs"></app-icon>
                  <span>Salin No. VA</span>
                </button>
              </div>

              <!-- Action Confirmation Button -->
              <div class="flex items-center justify-between pt-1">
                <span class="text-[11px] text-white/40">Transfer sesuai nominal persis hingga digit terakhir.</span>
                <app-button
                  variant="gold"
                  size="sm"
                  iconLeft="check-circle"
                  [loading]="processingTrxId() === trx.id"
                  (click)="onConfirmManualPayment(trx.id)">
                  Konfirmasi Pembayaran Manual
                </app-button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Payments History Table -->
      <div class="glass-panel rounded-2xl border border-navy-800 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-white/5 border-b border-navy-800 text-white/60 uppercase tracking-wider font-semibold">
              <tr>
                <th class="p-4">No. Transaksi</th>
                <th class="p-4">Layanan & Advokat</th>
                <th class="p-4">Metode Pembayaran</th>
                <th class="p-4">Jumlah (Rp)</th>
                <th class="p-4">Status Verifikasi</th>
                <th class="p-4 text-right">Rincian</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-navy-800/60 text-white/90">
              @for (item of paymentService.customerPayments(); track item.id) {
                <tr class="hover:bg-white/[0.02] transition-colors">
                  <td class="p-4 font-mono font-bold text-brand-400">#{{ item.id }}</td>
                  <td class="p-4">
                    <div class="font-semibold text-white">{{ item.serviceTitle }}</div>
                    <div class="text-[11px] text-white/50">{{ item.professionalName }}</div>
                  </td>
                  <td class="p-4 text-white/70">{{ item.paymentMethod }}</td>
                  <td class="p-4 font-semibold text-amber-400">Rp {{ item.amount | number:'1.0-0' }}</td>
                  <td class="p-4">
                    @if (item.status === 'PAID') {
                      <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1 w-fit">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>TERVERIFIKASI (PAID)</span>
                      </span>
                    } @else if (item.status === 'VERIFYING') {
                      <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/10 border border-purple-500/30 text-purple-300 flex items-center gap-1 w-fit">
                        <span class="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
                        <span>DALAM VERIFIKASI ADMIN</span>
                      </span>
                    } @else {
                      <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1 w-fit">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        <span>MENUNGGU TRANSFER</span>
                      </span>
                    }
                  </td>
                  <td class="p-4 text-right">
                    <a [routerLink]="['/portal/customer/bookings', item.bookingId]">
                      <app-button variant="outline" size="sm">Detail Sesi</app-button>
                    </a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Toast Container -->
      <app-toast></app-toast>

    </div>
  `
})
export class CustomerPaymentsComponent {
  public readonly paymentService = inject(CustomerPaymentService);
  private readonly notify = inject(NotificationService);

  public processingTrxId = signal<string | null>(null);

  public copyVaNumber(va: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(va);
    }
    this.notify.success('Berhasil Disalin', `Nomor VA ${va} telah disalin ke clipboard.`);
  }

  public onConfirmManualPayment(id: string): void {
    this.processingTrxId.set(id);
    this.paymentService.confirmManualPayment(id).subscribe(() => {
      this.processingTrxId.set(null);
      this.notify.success('Pembayaran Terverifikasi', 'Konfirmasi pembayaran manual berhasil dikirim dan diverifikasi!');
    });
  }
}
