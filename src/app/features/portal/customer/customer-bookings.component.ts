import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerBookingService } from '../../../core/services/customer-booking.service';
import { BookingItem, BookingStatus } from '../../../core/models/booking.model';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { FilterBarComponent } from '../../../shared/components/ui/filter-bar/filter-bar.component';
import { EmptyStateComponent } from '../../../shared/components/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-customer-bookings',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IconComponent,
    StatusBadgeComponent,
    PortalPageHeaderComponent,
    ButtonComponent,
    FilterBarComponent,
    EmptyStateComponent
  ],
  template: `
    <div class="space-y-6">
      
      <!-- Page Header -->
      <app-portal-page-header
        categoryLabel="Portal Klien"
        title="Daftar Booking Konsultasi"
        subtitle="Pantau alur status permohonan, jadwal sesi video, serta instruksi pembayaran konsultasi Anda."
        [breadcrumbs]="[{ label: 'Portal Klien', url: '/portal/customer' }, { label: 'Booking Saya' }]">
        
        <a routerLink="/booking">
          <app-button variant="primary" size="md" iconLeft="plus">
            Booking Baru
          </app-button>
        </a>
      </app-portal-page-header>

      <!-- Filter & Search Bar -->
      <app-filter-bar
        searchPlaceholder="Cari advokat, layanan, atau nomor booking..."
        [filterGroups]="filterGroups"
        (searchChange)="onSearchChange($event)"
        (filterChange)="onFilterChange($event)"
        (reset)="onResetFilters()">
      </app-filter-bar>

      <!-- Status Filter Chips -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          (click)="selectedStatusFilter.set('ALL')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
          [ngClass]="selectedStatusFilter() === 'ALL' ? 'bg-brand-500 text-white shadow-md' : 'bg-white/5 text-white/70 hover:bg-white/10'">
          Semua ({{ bookingService.customerBookings().length }})
        </button>

        <button
          type="button"
          (click)="selectedStatusFilter.set('WAITING_PAYMENT')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
          [ngClass]="selectedStatusFilter() === 'WAITING_PAYMENT' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'bg-white/5 text-white/70 hover:bg-white/10'">
          Menunggu Pembayaran ({{ bookingService.pendingPaymentBookings().length }})
        </button>

        <button
          type="button"
          (click)="selectedStatusFilter.set('CONFIRMED')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
          [ngClass]="selectedStatusFilter() === 'CONFIRMED' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'bg-white/5 text-white/70 hover:bg-white/10'">
          Dikonfirmasi ({{ bookingService.upcomingBookings().length }})
        </button>

        <button
          type="button"
          (click)="selectedStatusFilter.set('COMPLETED')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
          [ngClass]="selectedStatusFilter() === 'COMPLETED' ? 'bg-blue-500 text-white shadow-md' : 'bg-white/5 text-white/70 hover:bg-white/10'">
          Selesai ({{ bookingService.completedBookings().length }})
        </button>
      </div>

      <!-- Bookings Cards Grid (Responsive Mobile & Desktop) -->
      @if (filteredBookings().length > 0) {
        <div class="space-y-4">
          @for (item of filteredBookings(); track item.id) {
            <div class="glass-panel p-5 sm:p-6 rounded-2xl border border-navy-800 hover:border-navy-700 transition-all space-y-4 shadow-sm">
              
              <!-- Card Header -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-800/60">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold font-mono text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">
                    #{{ item.id }}
                  </span>
                  <span class="text-xs text-white/40">• {{ item.createdAt }}</span>
                </div>
                <app-status-badge [status]="item.status"></app-status-badge>
              </div>

              <!-- Card Body -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start sm:items-center">
                
                <!-- Service & Lawyer Info -->
                <div class="lg:col-span-2 space-y-2">
                  <h3 class="text-base font-bold text-white font-heading">
                    {{ item.serviceTitle }}
                  </h3>
                  
                  <div class="flex items-center gap-3">
                    <img
                      [src]="item.professionalAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80'"
                      [alt]="item.professionalName"
                      class="w-9 h-9 rounded-full object-cover border border-white/10" />
                    <div>
                      <div class="text-xs font-semibold text-white/90">{{ item.professionalName }}</div>
                      <div class="text-[11px] text-white/50">{{ item.professionalTitle }}</div>
                    </div>
                  </div>
                </div>

                <!-- Schedule & Fee Details -->
                <div class="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1.5">
                  <div class="flex items-center justify-between text-white/80">
                    <span class="flex items-center gap-1.5 text-white/50">
                      <app-icon name="calendar" size="xs"></app-icon>
                      <span>Jadwal Sesi:</span>
                    </span>
                    <span class="font-medium text-white">{{ item.selectedDate }}</span>
                  </div>
                  <div class="flex items-center justify-between text-white/80">
                    <span class="flex items-center gap-1.5 text-white/50">
                      <app-icon name="clock" size="xs"></app-icon>
                      <span>Waktu:</span>
                    </span>
                    <span class="font-medium text-brand-300">{{ item.selectedTimeSlot }}</span>
                  </div>
                  <div class="flex items-center justify-between pt-1.5 border-t border-white/5 font-semibold">
                    <span class="text-white/50">Tarif:</span>
                    <span class="text-amber-400">Rp {{ item.consultationFee | number:'1.0-0' }}</span>
                  </div>
                </div>

              </div>

              <!-- Card Actions Bar -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-navy-800/60">
                <div class="text-xs text-white/60 flex items-center gap-1.5">
                  <app-icon name="video" size="xs" className="text-brand-400"></app-icon>
                  <span>{{ item.appointmentType === 'ONLINE_VIDEO' ? 'Sesi Online Video Call' : 'Tatap Muka / Review Dokumen' }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <a [routerLink]="['/portal/customer/bookings', item.id]">
                    <app-button variant="outline" size="sm" iconRight="arrow-right">
                      Detail Booking
                    </app-button>
                  </a>
                  
                  @if (item.status === 'WAITING_PAYMENT') {
                    <a [routerLink]="['/portal/customer/bookings', item.id]">
                      <app-button variant="gold" size="sm" iconLeft="credit-card">
                        Bayar Sekarang
                      </app-button>
                    </a>
                  }
                </div>
              </div>

            </div>
          }
        </div>
      } @else {
        <div class="glass-panel p-12 rounded-2xl border border-navy-800 text-center space-y-4">
          <app-empty-state
            title="Tidak ada booking ditemukan"
            description="Belum ada data booking konsultasi yang sesuai dengan kriteria pencarian Anda."
            iconName="calendar-x">
          </app-empty-state>
        </div>
      }

    </div>
  `
})
export class CustomerBookingsComponent {
  public readonly bookingService = inject(CustomerBookingService);

  public searchKeyword = signal<string>('');
  public selectedStatusFilter = signal<string>('ALL');

  public filterGroups = [
    {
      key: 'appointmentType',
      label: 'Jenis Sesi',
      options: [
        { label: 'Online Video Call', value: 'ONLINE_VIDEO' },
        { label: 'Tatap Muka', value: 'IN_PERSON' },
        { label: 'Review Dokumen', value: 'DOCUMENT_REVIEW' }
      ]
    }
  ];

  public filteredBookings = computed(() => {
    let list = this.bookingService.customerBookings();
    const search = this.searchKeyword().toLowerCase().trim();
    const status = this.selectedStatusFilter();

    if (search) {
      list = list.filter(b =>
        b.id.toLowerCase().includes(search) ||
        b.serviceTitle.toLowerCase().includes(search) ||
        b.professionalName.toLowerCase().includes(search)
      );
    }

    if (status !== 'ALL') {
      list = list.filter(b => b.status === status);
    }

    return list;
  });

  public onSearchChange(term: string): void {
    this.searchKeyword.set(term);
  }

  public onFilterChange(filters: Record<string, string>): void {
    if (filters['appointmentType']) {
      // additional filter logic if needed
    }
  }

  public onResetFilters(): void {
    this.searchKeyword.set('');
    this.selectedStatusFilter.set('ALL');
  }
}
