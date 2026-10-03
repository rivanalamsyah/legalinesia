import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerBookingService } from '../../../core/services/customer-booking.service';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-customer-consultations',
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
        title="Sesi Konsultasi Saya"
        subtitle="Akses link tatap muka online video call dan hasil catatan legal opinion yang dibagikan oleh advokat."
        [breadcrumbs]="[{ label: 'Portal Klien', url: '/portal/customer' }, { label: 'Sesi Konsultasi' }]">
        
        <a routerLink="/booking">
          <app-button variant="primary" size="md" iconLeft="calendar-plus">
            Jadwalkan Konsultasi
          </app-button>
        </a>
      </app-portal-page-header>

      <!-- Consultations List -->
      <div class="space-y-4">
        @for (item of bookingService.customerBookings(); track item.id) {
          <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-800/60 pb-3">
              <div class="flex items-center gap-3">
                <span class="text-xs font-mono font-bold text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">
                  #{{ item.id }}
                </span>
                <span class="text-xs text-white/50">• {{ item.selectedDate }} ({{ item.selectedTimeSlot }})</span>
              </div>
              <app-status-badge [status]="item.status"></app-status-badge>
            </div>

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="space-y-1">
                <h3 class="text-base font-bold text-white font-heading">{{ item.serviceTitle }}</h3>
                <p class="text-xs text-white/60">Advokat Pendamping: <strong class="text-white">{{ item.professionalName }}</strong></p>
                <p class="text-xs text-white/50 line-clamp-2 mt-1">{{ item.problemDescription }}</p>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                @if (item.meetingUrl && (item.status === 'CONFIRMED' || item.status === 'IN_SESSION')) {
                  <a [href]="item.meetingUrl" target="_blank" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20">
                    <app-icon name="video" size="xs"></app-icon>
                    <span>Gabung Video Call</span>
                  </a>
                }
                
                <a [routerLink]="['/portal/customer/bookings', item.id]">
                  <app-button variant="outline" size="sm" iconRight="chevron-right">
                    Rincian Sesi
                  </app-button>
                </a>
              </div>
            </div>

          </div>
        }
      </div>

    </div>
  `
})
export class CustomerConsultationsComponent {
  public readonly bookingService = inject(CustomerBookingService);
}
