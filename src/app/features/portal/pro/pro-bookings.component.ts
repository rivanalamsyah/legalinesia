import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProBookingService } from '../../../core/services/pro-booking.service';
import { BookingItem, BookingStatus } from '../../../core/models/booking.model';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { ConfirmationDialogComponent } from '../../../shared/components/ui/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-pro-bookings',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    PortalPageHeaderComponent,
    StatusBadgeComponent,
    ButtonComponent,
    IconComponent,
    ConfirmationDialogComponent
  ],
  template: `
    <div class="space-y-8">
      <!-- Standardized Page Header -->
      <app-portal-page-header
        categoryLabel="Legal Professional Portal"
        title="Bookings & Konsultasi Klien"
        subtitle="Kelola dan tinjau seluruh permohonan konsultasi dari klien yang ditujukan khusus kepada Anda."
        [breadcrumbs]="[{ label: 'Portal Advokat', url: '/portal/pro' }, { label: 'Bookings Klien' }]">
        
        <div class="text-xs text-brand-300 bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-lg font-mono">
          Total {{ filteredBookings().length }} Berkas Booking
        </div>
      </app-portal-page-header>

      <!-- Filter & Search Bar -->
      <div class="glass-panel p-4 rounded-2xl border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Search input -->
        <div class="relative flex-1 max-w-md">
          <app-icon name="search" size="xs" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"></app-icon>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Cari ID booking, nama klien, atau topik kasus..."
            class="w-full bg-navy-950/80 border border-navy-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-brand-500"
          />
        </div>

        <!-- Status Filter Tabs -->
        <div class="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0">
          @for (tab of statusTabs; track tab.value) {
            <button
              (click)="selectedStatus.set(tab.value)"
              [class]="selectedStatus() === tab.value
                ? 'px-3 py-1.5 rounded-lg bg-brand-500 text-white font-semibold text-xs transition-all shadow-sm'
                : 'px-3 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-navy-800/60 font-medium text-xs transition-all'"
            >
              {{ tab.label }}
            </button>
          }
        </div>
      </div>

      <!-- Bookings List -->
      @if (filteredBookings().length > 0) {
        <div class="space-y-4">
          @for (booking of filteredBookings(); track booking.id) {
            <div class="glass-panel p-6 rounded-2xl border border-navy-800 hover:border-brand-500/40 transition-all space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-800/80 pb-3">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-mono font-bold text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-md">{{ booking.id }}</span>
                  <app-status-badge [status]="booking.status"></app-status-badge>
                  <span class="text-xs text-white/50 bg-navy-900 px-2 py-0.5 rounded border border-navy-800 font-medium">{{ booking.appointmentType }}</span>
                </div>
                <span class="text-xs text-white/40">Diajukan: {{ booking.createdAt | date:'dd MMM yyyy HH:mm' }}</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Service & Case Info -->
                <div class="space-y-1.5 md:col-span-2">
                  <h3 class="text-base font-semibold text-white font-heading">{{ booking.serviceTitle }}</h3>
                  <p class="text-xs text-white/70 line-clamp-2 leading-relaxed">{{ booking.problemDescription }}</p>
                  
                  <div class="flex flex-wrap items-center gap-4 text-xs text-white/60 pt-2">
                    <span class="flex items-center gap-1.5 text-gold-400">
                      <app-icon name="calendar" size="xs"></app-icon>
                      {{ booking.selectedDate }} ({{ booking.selectedTimeSlot }})
                    </span>
                    <span class="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <app-icon name="receipt" size="xs"></app-icon>
                      Rp {{ booking.consultationFee.toLocaleString('id-ID') }}
                    </span>
                  </div>
                </div>

                <!-- Client Info & Quick Actions -->
                <div class="bg-navy-950/60 p-4 rounded-xl border border-navy-800/60 flex flex-col justify-between space-y-3">
                  <div>
                    <div class="text-xs text-white/40 uppercase tracking-wider font-semibold">Detail Klien</div>
                    <div class="text-sm font-semibold text-white mt-1">{{ booking.customerName }}</div>
                    <div class="text-xs text-white/60 font-mono">{{ booking.customerEmail }}</div>
                    @if (booking.customerPhone) {
                      <div class="text-xs text-white/50 font-mono">{{ booking.customerPhone }}</div>
                    }
                  </div>

                  <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-navy-800">
                    @if (booking.status === 'REQUESTED' || booking.status === 'UNDER_REVIEW') {
                      <app-button variant="primary" size="xs" iconLeft="check" (click)="onAccept(booking.id)">Terima</app-button>
                      <app-button variant="danger" size="xs" iconLeft="x" (click)="openRejectModal(booking.id)">Tolak</app-button>
                    }
                    @if (booking.status === 'CONFIRMED') {
                      <app-button variant="outline" size="xs" (click)="onStartSession(booking.id)">Mulai Sesi</app-button>
                    }
                    @if (booking.status === 'IN_SESSION') {
                      <app-button variant="secondary" size="xs" iconLeft="check-circle" (click)="confirmCompleteSession(booking.id)">Selesaikan</app-button>
                    }
                    <a [routerLink]="['/portal/pro/bookings', booking.id]">
                      <app-button variant="outline" size="xs">Detail Full</app-button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="glass-panel p-12 text-center rounded-2xl border border-navy-800 space-y-3">
          <div class="w-14 h-14 rounded-full bg-navy-800 text-white/40 flex items-center justify-center mx-auto">
            <app-icon name="calendar" size="lg"></app-icon>
          </div>
          <h3 class="text-base font-semibold text-white">Tidak ada booking yang ditemukan</h3>
          <p class="text-xs text-white/50 max-w-sm mx-auto">Belum ada booking yang sesuai dengan kriteria filter atau pencarian Anda.</p>
        </div>
      }

      <!-- Rejection Reason Modal -->
      @if (rejectBookingId()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="glass-panel w-full max-w-md p-6 rounded-2xl border border-navy-800 space-y-4">
            <div class="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 class="text-base font-semibold text-white font-heading">Alasan Penolakan Booking</h3>
              <button (click)="rejectBookingId.set(null)" class="text-white/40 hover:text-white">
                <app-icon name="x" size="sm"></app-icon>
              </button>
            </div>

            <div class="space-y-3 text-xs">
              <p class="text-white/70 leading-relaxed">
                Berikan penjelasan resmi alasan penolakan permohonan booking ini. Alasan ini akan dikirimkan ke akun Klien.
              </p>

              <div>
                <label class="block text-white/60 mb-1 font-semibold">Alasan Penolakan</label>
                <textarea
                  [(ngModel)]="rejectionReason"
                  rows="3"
                  placeholder="Misal: Jadwal bentrok dengan agenda sidang / Diluar bidang keahlian..."
                  class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white"
                ></textarea>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-3 border-t border-navy-800">
              <app-button variant="danger" size="sm" class="w-full" (click)="onConfirmReject()">Konfirmasi Tolak</app-button>
              <app-button variant="outline" size="sm" (click)="rejectBookingId.set(null)">Batal</app-button>
            </div>
          </div>
        </div>
      }

      <!-- Complete Session Dialog -->
      <app-confirmation-dialog
        [isOpen]="completeBookingId() !== null"
        title="Tandai Sesi Konsultasi Selesai?"
        message="Apakah Anda yakin sesi konsultasi ini telah selesai dilaksanakan? Status booking akan diperbarui menjadi Completed."
        confirmText="Selesaikan Sesi"
        variant="info"
        (confirm)="onConfirmCompleteSession()"
        (cancel)="completeBookingId.set(null)">
      </app-confirmation-dialog>

    </div>
  `
})
export class ProBookingsComponent {
  public readonly proService = inject(ProBookingService);
  public searchQuery = '';
  public selectedStatus = signal<string>('ALL');

  public rejectBookingId = signal<string | null>(null);
  public rejectionReason = '';
  public completeBookingId = signal<string | null>(null);

  public readonly statusTabs = [
    { label: 'Semua Status', value: 'ALL' },
    { label: 'Pending Request', value: 'REQUESTED' },
    { label: 'Dikonfirmasi', value: 'CONFIRMED' },
    { label: 'Sesi Dimulai', value: 'IN_SESSION' },
    { label: 'Selesai', value: 'COMPLETED' }
  ];

  public readonly filteredBookings = computed(() => {
    let list = this.proService.proBookings();
    const status = this.selectedStatus();
    const q = this.searchQuery.toLowerCase().trim();

    if (status !== 'ALL') {
      if (status === 'REQUESTED') {
        list = list.filter(b => b.status === 'REQUESTED' || b.status === 'UNDER_REVIEW');
      } else {
        list = list.filter(b => b.status === status);
      }
    }

    if (q) {
      list = list.filter(b =>
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.serviceTitle.toLowerCase().includes(q) ||
        b.problemDescription.toLowerCase().includes(q)
      );
    }

    return list;
  });

  public onAccept(id: string): void {
    this.proService.acceptBooking(id);
  }

  public openRejectModal(id: string): void {
    this.rejectBookingId.set(id);
    this.rejectionReason = '';
  }

  public onConfirmReject(): void {
    const id = this.rejectBookingId();
    if (id && this.rejectionReason) {
      this.proService.rejectBooking(id, this.rejectionReason);
      this.rejectBookingId.set(null);
    }
  }

  public onStartSession(id: string): void {
    this.proService.startSession(id);
  }

  public confirmCompleteSession(id: string): void {
    this.completeBookingId.set(id);
  }

  public onConfirmCompleteSession(): void {
    const id = this.completeBookingId();
    if (id) {
      this.proService.completeSession(id);
      this.completeBookingId.set(null);
    }
  }
}
