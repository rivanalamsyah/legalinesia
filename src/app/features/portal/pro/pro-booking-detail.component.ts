import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProBookingService } from '../../../core/services/pro-booking.service';
import { BookingItem } from '../../../core/models/booking.model';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-pro-booking-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PortalPageHeaderComponent,
    StatusBadgeComponent,
    ButtonComponent,
    IconComponent
  ],
  template: `
    <div class="space-y-8">
      @if (booking) {
        <!-- Page Header -->
        <app-portal-page-header
          categoryLabel="Detail Booking Klien"
          [title]="'Booking ' + booking.id"
          [subtitle]="'Layanan: ' + booking.serviceTitle"
          [breadcrumbs]="[
            { label: 'Portal Advokat', url: '/portal/pro' },
            { label: 'Bookings Klien', url: '/portal/pro/bookings' },
            { label: booking.id }
          ]">
          
          <div class="flex items-center gap-3">
            <app-status-badge [status]="booking.status"></app-status-badge>
            <a routerLink="/portal/pro/bookings">
              <app-button variant="outline" size="sm" iconLeft="arrow-left">Kembali</app-button>
            </a>
          </div>
        </app-portal-page-header>

        <!-- Booking Main Card Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Left Info Column (2 cols) -->
          <div class="lg:col-span-2 space-y-6">

            <!-- Problem Description & Documents -->
            <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
              <h3 class="text-base font-semibold text-white font-heading flex items-center gap-2">
                <app-icon name="file-text" size="sm" class="text-brand-400"></app-icon>
                <span>Permasalahan Hukum & Dokumen Pendukung</span>
              </h3>

              <div class="bg-navy-950/70 p-4 rounded-xl border border-navy-800 space-y-2">
                <div class="text-xs font-semibold text-brand-400 uppercase tracking-wider">Kategori: {{ booking.problemCategory }}</div>
                <p class="text-sm text-white/90 leading-relaxed whitespace-pre-line">{{ booking.problemDescription }}</p>
              </div>

              @if (booking.documentAttachments && booking.documentAttachments.length > 0) {
                <div class="space-y-2 pt-2">
                  <div class="text-xs font-semibold text-white/60">Lampiran Dokumen Klien:</div>
                  <div class="space-y-2">
                    @for (doc of booking.documentAttachments; track doc) {
                      <div class="p-3 rounded-xl bg-navy-900/60 border border-navy-800 flex items-center justify-between">
                        <div class="flex items-center gap-2.5">
                          <app-icon name="file-text" size="sm" class="text-brand-400"></app-icon>
                          <span class="text-xs font-medium text-white">{{ doc }}</span>
                        </div>
                        <app-button variant="outline" size="xs" iconLeft="external-link">Unduh Dokumen</app-button>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Audit Timeline -->
            <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
              <h3 class="text-base font-semibold text-white font-heading flex items-center gap-2">
                <app-icon name="clock" size="sm" class="text-gold-400"></app-icon>
                <span>Riwayat Perkembangan Booking (Audit Trail)</span>
              </h3>

              <div class="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-navy-800">
                @for (event of booking.timeline; track $index) {
                  <div class="flex items-start gap-4 relative">
                    <div class="w-7 h-7 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/40 flex items-center justify-center shrink-0 z-10 text-xs font-bold">
                      {{ $index + 1 }}
                    </div>
                    <div class="bg-navy-950/60 p-3 rounded-xl border border-navy-800/80 flex-1">
                      <div class="flex items-center justify-between text-xs">
                        <span class="font-semibold text-white">{{ event.label }}</span>
                        <span class="text-white/40 font-mono">{{ event.timestamp }}</span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

          </div>

          <!-- Right Sidebar Column (1 col) -->
          <div class="space-y-6">

            <!-- Client & Fee Summary -->
            <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
              <h3 class="text-sm font-semibold text-white uppercase tracking-wider font-heading">Informasi Klien</h3>
              
              <div class="space-y-2 text-xs">
                <div class="flex justify-between py-1 border-b border-navy-800">
                  <span class="text-white/50">Nama Klien</span>
                  <span class="text-white font-semibold">{{ booking.customerName }}</span>
                </div>
                <div class="flex justify-between py-1 border-b border-navy-800">
                  <span class="text-white/50">Email</span>
                  <span class="text-white/90 font-mono">{{ booking.customerEmail }}</span>
                </div>
                @if (booking.customerPhone) {
                  <div class="flex justify-between py-1 border-b border-navy-800">
                    <span class="text-white/50">Telepon / WA</span>
                    <span class="text-white/90 font-mono">{{ booking.customerPhone }}</span>
                  </div>
                }
                <div class="flex justify-between py-1 border-b border-navy-800">
                  <span class="text-white/50">Jadwal Sesi</span>
                  <span class="text-gold-400 font-semibold">{{ booking.selectedDate }} ({{ booking.selectedTimeSlot }})</span>
                </div>
                <div class="flex justify-between py-1">
                  <span class="text-white/50">Honorarium Konsultasi</span>
                  <span class="text-emerald-400 font-bold">Rp {{ booking.consultationFee.toLocaleString('id-ID') }}</span>
                </div>
              </div>

              <!-- State Machine Action Bar -->
              <div class="pt-4 border-t border-navy-800 space-y-2">
                @if (booking.status === 'REQUESTED' || booking.status === 'UNDER_REVIEW') {
                  <app-button variant="primary" size="sm" class="w-full" iconLeft="check" (click)="onAccept()">Terima Permintaan</app-button>
                  <app-button variant="danger" size="sm" class="w-full" iconLeft="x" (click)="onReject()">Tolak Booking</app-button>
                }
                @if (booking.status === 'CONFIRMED') {
                  @if (booking.meetingUrl) {
                    <a [href]="booking.meetingUrl" target="_blank" class="block">
                      <app-button variant="primary" size="sm" class="w-full" iconLeft="video">Buka Room Video Call</app-button>
                    </a>
                  }
                  <app-button variant="outline" size="sm" class="w-full mt-2" (click)="onStartSession()">Mulai Sesi Konsultasi</app-button>
                }
                @if (booking.status === 'IN_SESSION') {
                  <app-button variant="secondary" size="sm" class="w-full" iconLeft="check-circle" (click)="onCompleteSession()">Tandai Konsultasi Selesai</app-button>
                }
                @if (booking.status === 'COMPLETED') {
                  <a routerLink="/portal/pro/case-notes" class="block">
                    <app-button variant="primary" size="sm" class="w-full" iconLeft="notebook-pen">Tulis Consultation Note</app-button>
                  </a>
                }
              </div>
            </div>

          </div>

        </div>
      } @else {
        <div class="glass-panel p-12 text-center rounded-2xl border border-navy-800 space-y-3">
          <h3 class="text-base font-semibold text-white">Booking Tidak Ditemukan</h3>
          <p class="text-xs text-white/50">Data booking tidak ditemukan atau Anda tidak memiliki akses ke data ini.</p>
          <a routerLink="/portal/pro/bookings">
            <app-button variant="outline" size="sm" class="mt-2">Kembali ke Daftar Bookings</app-button>
          </a>
        </div>
      }
    </div>
  `
})
export class ProBookingDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly proService = inject(ProBookingService);

  public booking: BookingItem | undefined;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.proService.getBookingById(id).subscribe(b => {
        this.booking = b;
      });
    }
  }

  public onAccept(): void {
    if (this.booking) {
      this.proService.acceptBooking(this.booking.id);
      this.reloadBooking();
    }
  }

  public onReject(): void {
    if (this.booking) {
      const reason = prompt('Masukkan alasan penolakan:');
      if (reason) {
        this.proService.rejectBooking(this.booking.id, reason);
        this.reloadBooking();
      }
    }
  }

  public onStartSession(): void {
    if (this.booking) {
      this.proService.startSession(this.booking.id);
      this.reloadBooking();
    }
  }

  public onCompleteSession(): void {
    if (this.booking) {
      this.proService.completeSession(this.booking.id);
      this.reloadBooking();
    }
  }

  private reloadBooking(): void {
    if (this.booking) {
      this.proService.getBookingById(this.booking.id).subscribe(b => {
        this.booking = b;
      });
    }
  }
}
