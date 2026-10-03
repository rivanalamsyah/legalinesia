import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ProBookingService } from '../../../core/services/pro-booking.service';
import { UserProfile } from '../../../core/models/user.model';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { KpiCardComponent } from '../../../shared/components/ui/kpi-card/kpi-card.component';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-pro-dashboard',
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
        categoryLabel="Legal Professional Workspace"
        [title]="'Selamat Datang, ' + (user?.fullName || 'Advokat Partner')"
        subtitle="Overview jadwal konsultasi hari ini, permohonan booking baru, catatan kasus, dan analisis pendapatan Anda."
        [breadcrumbs]="[{ label: 'Portal Advokat', url: '/portal/pro' }, { label: 'Overview' }]">
        
        <div class="flex items-center gap-2">
          <app-status-badge status="VERIFIED" label="PERADI VERIFIED"></app-status-badge>
          <a routerLink="/portal/pro/schedule">
            <app-button variant="outline" size="sm" iconLeft="clock">Atur Ketersediaan</app-button>
          </a>
        </div>
      </app-portal-page-header>

      <!-- KPI Metrics Grid (Strictly derived from actual ProBookingService data) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-kpi-card
          label="Konsultasi Hari Ini"
          [value]="proService.todayConsultations().length + ' Sesi'"
          [changeText]="proService.todayConsultations().length > 0 ? 'Siap dilaksanakan' : 'Tidak ada jadwal hari ini'"
          trend="neutral"
          iconName="calendar-check"
          iconVariant="primary">
        </app-kpi-card>

        <app-kpi-card
          label="Permintaan Booking Pending"
          [value]="proService.pendingRequests().length + ' Permintaan'"
          [changeText]="proService.pendingRequests().length > 0 ? 'Perlu tindakan cepat' : 'Semua permintaan diproses'"
          [trend]="proService.pendingRequests().length > 0 ? 'up' : 'neutral'"
          iconName="clock"
          iconVariant="warning">
        </app-kpi-card>

        <app-kpi-card
          label="Total Klien Aktif"
          [value]="proService.clientRoster().length + ' Klien'"
          [changeText]="'Rating Ulasan: ' + (proService.averageRating() || '5.0') + ' / 5.0'"
          trend="up"
          iconName="users"
          iconVariant="success">
        </app-kpi-card>

        <app-kpi-card
          label="Total Pendapatan Terverifikasi"
          [value]="'Rp ' + proService.totalRevenue().toLocaleString('id-ID')"
          changeText="Berdasarkan sesi selesai & berbayar"
          trend="up"
          iconName="receipt"
          iconVariant="gold">
        </app-kpi-card>
      </div>

      <!-- Quick Action Shortcuts -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3 hover:border-brand-500/40 transition-all">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <app-icon name="clock" size="sm"></app-icon>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-white font-heading">Atur Jadwal & Ketersediaan</h3>
              <p class="text-xs text-white/50">Jam kerja & tanggal libur</p>
            </div>
          </div>
          <p class="text-xs text-white/70 leading-relaxed pt-1">Buka slot waktu konsultasi untuk klien dan atur tanggal yang diblokir.</p>
          <a routerLink="/portal/pro/schedule" class="inline-flex items-center gap-1.5 text-xs text-brand-400 font-semibold hover:underline pt-2">
            <span>Kelola Jadwal</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3 hover:border-brand-500/40 transition-all">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <app-icon name="notebook-pen" size="sm"></app-icon>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-white font-heading">Tulis Consultation Note</h3>
              <p class="text-xs text-white/50">Dokumentasikan advis hukum</p>
            </div>
          </div>
          <p class="text-xs text-white/70 leading-relaxed pt-1">Buat resume hukum resmi dan rekomendasi langkah pasca konsultasi.</p>
          <a routerLink="/portal/pro/case-notes" class="inline-flex items-center gap-1.5 text-purple-400 font-semibold text-xs hover:underline pt-2">
            <span>Buat Catatan Baru</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3 hover:border-brand-500/40 transition-all">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <app-icon name="briefcase" size="sm"></app-icon>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-white font-heading">Kelola Layanan Hukum</h3>
              <p class="text-xs text-white/50">Spesialisasi & tarif</p>
            </div>
          </div>
          <p class="text-xs text-white/70 leading-relaxed pt-1">Perbarui paket konsultasi, tarif per jam, dan deskripsi cakupan layanan.</p>
          <a routerLink="/portal/pro/services" class="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-xs hover:underline pt-2">
            <span>Sunting Katalog Layanan</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>
      </div>

      <!-- Main Activity Split: Today's Schedule & Pending Requests -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Today's Schedule (2 cols) -->
        <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-navy-800 space-y-6">
          <div class="flex items-center justify-between border-b border-navy-800/80 pb-4">
            <div>
              <h2 class="text-base font-semibold text-white font-heading flex items-center gap-2">
                <app-icon name="calendar-check" size="sm" class="text-brand-400"></app-icon>
                <span>Jadwal Konsultasi Hari Ini</span>
              </h2>
              <p class="text-xs text-white/50 mt-0.5">Tanggal: {{ proService.todayDateStr }}</p>
            </div>
            <a routerLink="/portal/pro/calendar" class="text-xs text-brand-400 font-medium hover:underline flex items-center gap-1">
              <span>Lihat Kalender Lengkap</span>
              <app-icon name="arrow-right" size="xs"></app-icon>
            </a>
          </div>

          @if (proService.todayConsultations().length > 0) {
            <div class="space-y-4">
              @for (item of proService.todayConsultations(); track item.id) {
                <div class="p-4 rounded-xl bg-navy-950/70 border border-navy-800/80 hover:border-brand-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div class="space-y-1.5">
                    <div class="flex items-center gap-2">
                      <app-status-badge [status]="item.status"></app-status-badge>
                      <span class="text-xs font-mono text-white/50">{{ item.id }}</span>
                      <span class="text-xs px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 font-medium">{{ item.appointmentType }}</span>
                    </div>
                    <h4 class="text-sm font-semibold text-white">{{ item.serviceTitle }}</h4>
                    <div class="flex items-center gap-4 text-xs text-white/60">
                      <span class="flex items-center gap-1 text-gold-400">
                        <app-icon name="clock" size="xs"></app-icon>
                        {{ item.selectedTimeSlot }}
                      </span>
                      <span class="flex items-center gap-1">
                        <app-icon name="user" size="xs"></app-icon>
                        Klien: <strong>{{ item.customerName }}</strong>
                      </span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-navy-800">
                    @if (item.meetingUrl && item.status === 'CONFIRMED') {
                      <a [href]="item.meetingUrl" target="_blank">
                        <app-button variant="primary" size="sm" iconLeft="video">Buka Video Call</app-button>
                      </a>
                    }
                    @if (item.status === 'CONFIRMED') {
                      <app-button variant="outline" size="sm" (click)="onStartSession(item.id)">Mulai Sesi</app-button>
                    }
                    @if (item.status === 'IN_SESSION') {
                      <app-button variant="secondary" size="sm" iconLeft="check-circle" (click)="onCompleteSession(item.id)">Selesaikan Sesi</app-button>
                    }
                    <a [routerLink]="['/portal/pro/bookings', item.id]">
                      <app-button variant="outline" size="sm">Detail</app-button>
                    </a>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="py-10 text-center space-y-3 bg-navy-950/40 rounded-xl border border-dashed border-navy-800">
              <div class="w-12 h-12 rounded-full bg-navy-800 text-white/40 flex items-center justify-center mx-auto">
                <app-icon name="calendar" size="md"></app-icon>
              </div>
              <p class="text-sm text-white/70 font-medium">Tidak ada jadwal konsultasi hari ini.</p>
              <p class="text-xs text-white/50 max-w-sm mx-auto">Slot ketersediaan Anda tetap aktif untuk menerima booking baru dari klien.</p>
            </div>
          }
        </div>

        <!-- Pending Booking Requests & Actions (1 col) -->
        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-6">
          <div class="border-b border-navy-800/80 pb-4 flex items-center justify-between">
            <h3 class="text-base font-semibold text-white font-heading flex items-center gap-2">
              <app-icon name="clock" size="sm" class="text-gold-400"></app-icon>
              <span>Permintaan Masuk</span>
            </h3>
            <span class="text-xs px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-semibold">
              {{ proService.pendingRequests().length }} Pending
            </span>
          </div>

          @if (proService.pendingRequests().length > 0) {
            <div class="space-y-4">
              @for (req of proService.pendingRequests(); track req.id) {
                <div class="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-mono text-brand-400 font-semibold">{{ req.id }}</span>
                    <app-status-badge [status]="req.status"></app-status-badge>
                  </div>
                  <div>
                    <h5 class="text-xs font-semibold text-white/90">{{ req.serviceTitle }}</h5>
                    <p class="text-xs text-white/60 mt-1 line-clamp-2">{{ req.problemDescription }}</p>
                  </div>
                  <div class="text-xs text-white/50 space-y-1 bg-navy-900/60 p-2.5 rounded-lg border border-navy-800/60">
                    <div>Klien: <strong class="text-white/90">{{ req.customerName }}</strong></div>
                    <div>Jadwal: <span class="text-gold-400">{{ req.selectedDate }} ({{ req.selectedTimeSlot }})</span></div>
                  </div>
                  <div class="flex items-center gap-2 pt-1">
                    <app-button variant="primary" size="xs" iconLeft="check" (click)="onAccept(req.id)">Terima</app-button>
                    <app-button variant="danger" size="xs" iconLeft="x" (click)="onReject(req.id)">Tolak</app-button>
                    <a [routerLink]="['/portal/pro/bookings', req.id]" class="ml-auto">
                      <app-button variant="outline" size="xs">Detail</app-button>
                    </a>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="py-10 text-center space-y-2 bg-navy-950/40 rounded-xl border border-dashed border-navy-800">
              <app-icon name="check-circle" size="md" class="text-emerald-400 mx-auto opacity-70"></app-icon>
              <p class="text-xs text-white/70">Tidak ada permintaan booking yang pending saat ini.</p>
            </div>
          }
        </div>

      </div>

      <!-- Recent Completed Consultations & Notes -->
      <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
        <div class="flex items-center justify-between border-b border-navy-800 pb-4">
          <div>
            <h3 class="text-base font-semibold text-white font-heading flex items-center gap-2">
              <app-icon name="notebook-pen" size="sm" class="text-purple-400"></app-icon>
              <span>Consultation Notes Terakhir</span>
            </h3>
            <p class="text-xs text-white/50 mt-0.5">Resume hukum dan rekomendasi yang telah diberikan kepada klien</p>
          </div>
          <a routerLink="/portal/pro/case-notes" class="text-xs text-purple-400 font-medium hover:underline flex items-center gap-1">
            <span>Kelola Semua Notes</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>

        @if (proService.consultationNotes().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (note of proService.consultationNotes(); track note.id) {
              <div class="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono text-purple-400 font-semibold">{{ note.id }}</span>
                  <span class="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                    {{ note.isSharedWithCustomer ? 'Terbagikan ke Klien' : 'Internal Advokat' }}
                  </span>
                </div>
                <h4 class="text-sm font-semibold text-white">{{ note.title }}</h4>
                <p class="text-xs text-white/60 line-clamp-2">{{ note.summary }}</p>
                <div class="text-xs text-white/40 pt-2 flex items-center justify-between border-t border-navy-800/60">
                  <span>Klien: {{ note.customerName }}</span>
                  <span>{{ note.createdAt | date:'dd MMM yyyy' }}</span>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="py-8 text-center text-xs text-white/50">
            Belum ada catatan konsultasi yang dibuat.
          </div>
        }
      </div>

    </div>
  `
})
export class ProDashboardComponent {
  private readonly authState = inject(AuthStateService);
  public readonly proService = inject(ProBookingService);

  public get user(): UserProfile | null { return this.authState.currentUser(); }

  public onAccept(id: string): void {
    this.proService.acceptBooking(id);
  }

  public onReject(id: string): void {
    const reason = prompt('Masukkan alasan penolakan booking:');
    if (reason) {
      this.proService.rejectBooking(id, reason);
    }
  }

  public onStartSession(id: string): void {
    this.proService.startSession(id);
  }

  public onCompleteSession(id: string): void {
    this.proService.completeSession(id);
  }
}
