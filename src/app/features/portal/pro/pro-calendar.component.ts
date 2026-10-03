import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProBookingService } from '../../../core/services/pro-booking.service';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-pro-calendar',
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
      <!-- Page Header -->
      <app-portal-page-header
        categoryLabel="Legal Professional Portal"
        title="Kalender Sesi & Ketersediaan"
        subtitle="Lihat dan sinkronkan jadwal sesi konsultasi mendatang dengan kalender ketersediaan mingguan Anda."
        [breadcrumbs]="[{ label: 'Portal Advokat', url: '/portal/pro' }, { label: 'Kalender Sesi' }]">
        
        <a routerLink="/portal/pro/schedule">
          <app-button variant="outline" size="sm" iconLeft="clock">Kelola Slot Ketersediaan</app-button>
        </a>
      </app-portal-page-header>

      <!-- Calendar Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left: Agenda View of Sessions (2 cols) -->
        <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-navy-800 space-y-6">
          <div class="flex items-center justify-between border-b border-navy-800 pb-4">
            <h3 class="text-base font-semibold text-white font-heading flex items-center gap-2">
              <app-icon name="calendar" size="sm" class="text-brand-400"></app-icon>
              <span>Agenda Konsultasi Mendatang</span>
            </h3>
            <span class="text-xs text-white/50">Waktu Indonesia Barat (WIB)</span>
          </div>

          @if (proService.upcomingBookings().length > 0) {
            <div class="space-y-4">
              @for (item of proService.upcomingBookings(); track item.id) {
                <div class="p-4 rounded-xl bg-navy-950/70 border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-mono font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded">{{ item.selectedDate }}</span>
                      <span class="text-xs font-medium text-white/80">{{ item.selectedTimeSlot }}</span>
                      <app-status-badge [status]="item.status"></app-status-badge>
                    </div>
                    <h4 class="text-sm font-semibold text-white mt-1">{{ item.serviceTitle }}</h4>
                    <p class="text-xs text-white/60">Klien: <strong>{{ item.customerName }}</strong> ({{ item.customerEmail }})</p>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    @if (item.meetingUrl) {
                      <a [href]="item.meetingUrl" target="_blank">
                        <app-button variant="primary" size="xs" iconLeft="video">Join Meeting</app-button>
                      </a>
                    }
                    <a [routerLink]="['/portal/pro/bookings', item.id]">
                      <app-button variant="outline" size="xs">Detail</app-button>
                    </a>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="py-12 text-center space-y-2 bg-navy-950/40 rounded-xl border border-dashed border-navy-800">
              <app-icon name="calendar" size="lg" class="text-white/30 mx-auto"></app-icon>
              <p class="text-sm font-semibold text-white">Belum Ada Sesi Terjadwal</p>
              <p class="text-xs text-white/50">Jadwal konsultasi yang dikonfirmasi oleh Anda akan muncul di sini.</p>
            </div>
          }
        </div>

        <!-- Right: Weekly Slot Breakdown & Timezone Info (1 col) -->
        <div class="space-y-6">
          <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
            <h4 class="text-sm font-semibold text-white font-heading uppercase tracking-wider">Ringkasan Jam Kerja</h4>
            <div class="text-xs text-white/60 space-y-2">
              <div class="flex justify-between py-1.5 border-b border-navy-800">
                <span>Zona Waktu:</span>
                <span class="text-white font-mono">{{ proService.schedule().timezone }}</span>
              </div>
              <div class="flex justify-between py-1.5 border-b border-navy-800">
                <span>Slot Aktif Mingguan:</span>
                <span class="text-brand-400 font-bold">{{ activeSlotCount }} Slot</span>
              </div>
              <div class="flex justify-between py-1.5 border-b border-navy-800">
                <span>Notice Period:</span>
                <span class="text-white font-semibold">{{ proService.schedule().noticePeriodHours }} Jam Sebelum Sesi</span>
              </div>
              <div class="flex justify-between py-1.5">
                <span>Auto-Confirm Booking:</span>
                <span class="text-gold-400 font-semibold">{{ proService.schedule().autoConfirmBooking ? 'Aktif' : 'Non-Aktif (Manual Approval)' }}</span>
              </div>
            </div>

            <a routerLink="/portal/pro/schedule" class="block pt-2">
              <app-button variant="outline" size="sm" class="w-full">Kelola Ketersediaan Mingguan</app-button>
            </a>
          </div>

          <!-- Blocked Dates -->
          <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
            <h4 class="text-sm font-semibold text-white font-heading flex items-center gap-2">
              <app-icon name="x" size="xs" class="text-rose-400"></app-icon>
              <span>Tanggal Berhalangan / Libur</span>
            </h4>

            @if (proService.schedule().blockedDates.length > 0) {
              <div class="space-y-2">
                @for (blocked of proService.schedule().blockedDates; track blocked.date) {
                  <div class="p-3 rounded-xl bg-navy-950/80 border border-navy-800 flex items-center justify-between text-xs">
                    <div>
                      <span class="font-mono text-rose-400 font-semibold">{{ blocked.date }}</span>
                      @if (blocked.reason) {
                        <p class="text-white/60 mt-0.5">{{ blocked.reason }}</p>
                      }
                    </div>
                    <span class="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] uppercase font-bold">Blocked</span>
                  </div>
                }
              </div>
            } @else {
              <p class="text-xs text-white/50">Tidak ada tanggal libur yang diblokir.</p>
            }
          </div>
        </div>

      </div>
    </div>
  `
})
export class ProCalendarComponent {
  public readonly proService = inject(ProBookingService);

  public get activeSlotCount(): number {
    return this.proService.schedule().weeklySlots.filter(s => s.isActive).length;
  }
}
