import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerBookingService } from '../../../core/services/customer-booking.service';
import { BookingItem, BookingStatus, canTransitionBooking } from '../../../core/models/booking.model';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ConfirmationDialogComponent } from '../../../shared/components/ui/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-customer-booking-detail',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    StatusBadgeComponent,
    PortalPageHeaderComponent,
    ButtonComponent,
    ConfirmationDialogComponent
  ],
  template: `
    @if (booking()) {
      <div class="space-y-8 max-w-5xl">
        
        <!-- Page Header -->
        <app-portal-page-header
          categoryLabel="Detail Booking Konsultasi"
          [title]="'# ' + booking()!.id"
          [subtitle]="booking()!.serviceTitle"
          [breadcrumbs]="[
            { label: 'Portal Klien', url: '/portal/customer' },
            { label: 'Booking Saya', url: '/portal/customer/bookings' },
            { label: booking()!.id }
          ]">
          
          <app-status-badge [status]="booking()!.status" size="md"></app-status-badge>
        </app-portal-page-header>

        <!-- State Machine Workflow Timeline Bar -->
        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
          <h2 class="text-xs font-bold text-white/50 uppercase tracking-wider">
            Alur Status Permohonan Konsultasi (State Machine)
          </h2>

          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
            @for (step of stateMachineSteps; track step.key) {
              <div
                class="p-3 rounded-xl border text-xs text-center flex flex-col items-center justify-center space-y-1 transition-all"
                [ngClass]="{
                  'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold shadow-sm': isStepPassed(step.key),
                  'bg-brand-500/20 border-brand-400 text-white font-bold ring-2 ring-brand-400/50': booking()!.status === step.key,
                  'bg-white/5 border-white/10 text-white/40': !isStepPassed(step.key) && booking()!.status !== step.key
                }">
                <app-icon [name]="step.icon" size="xs"></app-icon>
                <span class="text-[11px] leading-tight">{{ step.label }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Main Details Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Left Column: Legal Pro & Case Details -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Professional Card -->
            <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
              <h3 class="text-sm font-semibold text-white/60 uppercase tracking-wider">Advokat Pendamping</h3>
              
              <div class="flex items-start gap-4">
                <img
                  [src]="booking()!.professionalAvatar || '/images/avatars/avatar-male-1.svg'"
                  [alt]="booking()!.professionalName"
                  class="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-md" />

                <div class="space-y-1">
                  <h4 class="text-lg font-bold text-white font-heading">{{ booking()!.professionalName }}</h4>
                  <p class="text-xs text-brand-300 font-medium">{{ booking()!.professionalTitle }}</p>
                  @if (booking()!.barLicenseNumber) {
                    <p class="text-[11px] text-white/50">Lisensi Advokat: {{ booking()!.barLicenseNumber }}</p>
                  }
                </div>
              </div>
            </div>

            <!-- Problem Description & Attachments -->
            <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
              <h3 class="text-sm font-semibold text-white/60 uppercase tracking-wider">Rincian Pokok Permasalahan</h3>
              
              <div class="space-y-2">
                <div class="text-xs font-semibold text-brand-400 uppercase">Kategori: {{ booking()!.problemCategory }}</div>
                <p class="text-sm text-white/80 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                  {{ booking()!.problemDescription }}
                </p>
              </div>

              @if (booking()!.documentAttachments && booking()!.documentAttachments!.length > 0) {
                <div class="pt-2">
                  <h4 class="text-xs font-semibold text-white/70 mb-2">Berkas Pendukung Diunggah:</h4>
                  <div class="flex flex-wrap gap-2">
                    @for (doc of booking()!.documentAttachments; track doc) {
                      <div class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white flex items-center gap-2">
                        <app-icon name="file-text" size="xs" className="text-brand-400"></app-icon>
                        <span>{{ doc }}</span>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Timeline Audit Log -->
            <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
              <h3 class="text-sm font-semibold text-white/60 uppercase tracking-wider">Riwayat Aktivitas & Timeline</h3>
              
              <div class="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-navy-800">
                @for (item of booking()!.timeline; track item.timestamp) {
                  <div class="flex items-start gap-4 relative pl-8">
                    <div class="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-brand-400 border-2 border-navy-950"></div>
                    <div class="space-y-0.5">
                      <div class="text-xs font-semibold text-white">{{ item.label }}</div>
                      <div class="text-[11px] text-white/40">{{ item.timestamp }}</div>
                    </div>
                  </div>
                }
              </div>
            </div>

          </div>

          <!-- Right Column: Schedule, Payment, & Actions -->
          <div class="space-y-6">
            
            <!-- Schedule & Meeting Link Card -->
            <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
              <h3 class="text-sm font-semibold text-white/60 uppercase tracking-wider">Waktu & Link Pertemuan</h3>
              
              <div class="space-y-3 text-xs">
                <div class="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div class="text-white/50">Tanggal Sesi:</div>
                  <div class="text-sm font-bold text-white">{{ booking()!.selectedDate }}</div>
                </div>

                <div class="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div class="text-white/50">Waktu & Durasi:</div>
                  <div class="text-sm font-bold text-brand-300">{{ booking()!.selectedTimeSlot }}</div>
                </div>

                @if (booking()!.meetingUrl && (booking()!.status === 'CONFIRMED' || booking()!.status === 'IN_SESSION')) {
                  <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                    <div class="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                      <app-icon name="video" size="xs"></app-icon>
                      <span>Link Sesi Video Telekonferensi:</span>
                    </div>
                    <a
                      [href]="booking()!.meetingUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="block text-center py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20">
                      Gabung Google Meet Sesi
                    </a>
                  </div>
                }
              </div>
            </div>

            <!-- Fee & Payment Action Card -->
            <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
              <h3 class="text-sm font-semibold text-white/60 uppercase tracking-wider">Rincian Pembayaran</h3>

              <div class="space-y-2 text-xs">
                <div class="flex justify-between text-white/70">
                  <span>Biaya Konsultasi:</span>
                  <span class="font-semibold text-white">Rp {{ booking()!.consultationFee | number:'1.0-0' }}</span>
                </div>
                <div class="flex justify-between text-white/70">
                  <span>Biaya Layanan Platform:</span>
                  <span class="font-semibold text-emerald-400">Gratis</span>
                </div>
                <div class="flex justify-between text-sm font-bold pt-2 border-t border-white/10 text-white">
                  <span>Total Tagihan:</span>
                  <span class="text-amber-400">Rp {{ booking()!.consultationFee | number:'1.0-0' }}</span>
                </div>
              </div>

              <!-- Action buttons based on current state -->
              <div class="pt-2 space-y-2">
                @if (booking()!.status === 'WAITING_PAYMENT') {
                  <app-button
                    variant="gold"
                    size="md"
                    fullWidth
                    iconLeft="credit-card"
                    [loading]="isProcessing"
                    (click)="onConfirmPayment()">
                    Konfirmasi Pembayaran
                  </app-button>
                }

                @if (canCancelCurrentBooking()) {
                  <app-button
                    variant="outline"
                    size="md"
                    fullWidth
                    (click)="isCancelModalOpen.set(true)">
                    Batalkan Permohonan
                  </app-button>
                }
              </div>
            </div>

          </div>

        </div>

        <!-- Cancellation Confirmation Modal -->
        <app-confirmation-dialog
          [isOpen]="isCancelModalOpen()"
          title="Batalkan Booking Konsultasi?"
          message="Apakah Anda yakin ingin membatalkan jadwal booking konsultasi ini? Aksi ini tidak dapat dibatalkan."
          confirmText="Ya, Batalkan Booking"
          cancelText="Batal"
          variant="danger"
          [loading]="isProcessing"
          (confirm)="onExecuteCancel()"
          (cancel)="isCancelModalOpen.set(false)">
        </app-confirmation-dialog>

      </div>
    } @else {
      <div class="p-12 text-center text-white/60 space-y-3">
        <p>Memuat rincian booking...</p>
      </div>
    }
  `
})
export class CustomerBookingDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookingService = inject(CustomerBookingService);

  public booking = signal<BookingItem | undefined>(undefined);
  public isCancelModalOpen = signal<boolean>(false);
  public isProcessing = false;

  public stateMachineSteps: { key: BookingStatus; label: string; icon: string }[] = [
    { key: 'REQUESTED', label: 'Draft', icon: 'file-text' },
    { key: 'UNDER_REVIEW', label: 'Review Advokat', icon: 'search' },
    { key: 'WAITING_PAYMENT', label: 'Pembayaran', icon: 'credit-card' },
    { key: 'PAYMENT_VERIFIED', label: 'Terverifikasi', icon: 'shield-check' },
    { key: 'CONFIRMED', label: 'Dikonfirmasi', icon: 'calendar-check' },
    { key: 'IN_SESSION', label: 'Sesi Berlangsung', icon: 'video' },
    { key: 'COMPLETED', label: 'Selesai', icon: 'check-circle' }
  ];

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookingService.getBookingById(id).subscribe(data => {
        this.booking.set(data);
      });
    }
  }

  public isStepPassed(stepKey: BookingStatus): boolean {
    const b = this.booking();
    if (!b) return false;
    const order: BookingStatus[] = ['REQUESTED', 'UNDER_REVIEW', 'WAITING_PAYMENT', 'PAYMENT_VERIFIED', 'CONFIRMED', 'IN_SESSION', 'COMPLETED'];
    const currentIndex = order.indexOf(b.status);
    const stepIndex = order.indexOf(stepKey);
    return stepIndex >= 0 && stepIndex < currentIndex;
  }

  public canCancelCurrentBooking(): boolean {
    const b = this.booking();
    if (!b) return false;
    return canTransitionBooking(b.status, 'CANCELLED');
  }

  public onConfirmPayment(): void {
    const b = this.booking();
    if (!b) return;
    this.isProcessing = true;
    setTimeout(() => {
      this.bookingService.updateBookingStatus(b.id, 'PAYMENT_VERIFIED', 'Pembayaran Rp 350.000 terverifikasi otomatis.');
      this.bookingService.updateBookingStatus(b.id, 'CONFIRMED', 'Jadwal sesi video call dikonfirmasi.');
      this.bookingService.getBookingById(b.id).subscribe(updated => this.booking.set(updated));
      this.isProcessing = false;
    }, 600);
  }

  public onExecuteCancel(): void {
    const b = this.booking();
    if (!b) return;
    this.isProcessing = true;
    setTimeout(() => {
      this.bookingService.cancelBooking(b.id, 'Dibatalkan atas permintaan Klien.');
      this.bookingService.getBookingById(b.id).subscribe(updated => this.booking.set(updated));
      this.isProcessing = false;
      this.isCancelModalOpen.set(false);
    }, 600);
  }
}
