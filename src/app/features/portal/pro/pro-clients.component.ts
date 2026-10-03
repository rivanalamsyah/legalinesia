import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProBookingService } from '../../../core/services/pro-booking.service';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-pro-clients',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    PortalPageHeaderComponent,
    ButtonComponent,
    IconComponent
  ],
  template: `
    <div class="space-y-8">
      <!-- Page Header -->
      <app-portal-page-header
        categoryLabel="Legal Professional Portal"
        title="Daftar Klien Ditangani"
        subtitle="Direktori klien yang memiliki riwayat booking atau konsultasi aktif khusus dengan Anda."
        [breadcrumbs]="[{ label: 'Portal Advokat', url: '/portal/pro' }, { label: 'Daftar Klien' }]">
        
        <div class="text-xs text-white/60 bg-navy-900 border border-navy-800 px-3 py-1.5 rounded-lg font-mono">
          Total {{ proService.clientRoster().length }} Klien
        </div>
      </app-portal-page-header>

      <!-- Search Input -->
      <div class="glass-panel p-4 rounded-2xl border border-navy-800 flex items-center gap-4">
        <div class="relative flex-1 max-w-md">
          <app-icon name="search" size="xs" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"></app-icon>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Cari nama klien, email, atau nomor telepon..."
            class="w-full bg-navy-950/80 border border-navy-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      <!-- Clients Directory Grid -->
      @if (filteredClients().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (client of filteredClients(); track client.id) {
            <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4 hover:border-brand-500/40 transition-all flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full bg-brand-500/20 text-brand-300 font-bold flex items-center justify-center text-lg border border-brand-500/30">
                    {{ client.name.charAt(0) }}
                  </div>
                  <div>
                    <h3 class="text-base font-semibold text-white font-heading">{{ client.name }}</h3>
                    <p class="text-xs text-white/60 font-mono">{{ client.email }}</p>
                  </div>
                </div>

                <div class="bg-navy-950/70 p-3 rounded-xl border border-navy-800/80 space-y-1.5 text-xs">
                  <div class="flex justify-between">
                    <span class="text-white/50">Total Booking:</span>
                    <span class="text-white font-bold">{{ client.totalBookings }} Sesi</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/50">Kasus Aktif:</span>
                    <span class="text-gold-400 font-semibold">{{ client.activeCasesCount }} Kasus</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/50">Konsultasi Terakhir:</span>
                    <span class="text-white/80 font-mono">{{ client.lastConsultationDate }}</span>
                  </div>
                </div>
              </div>

              <div class="pt-3 border-t border-navy-800 flex items-center gap-2">
                <a routerLink="/portal/pro/bookings" [queryParams]="{ q: client.name }" class="w-full">
                  <app-button variant="outline" size="xs" class="w-full" iconLeft="calendar">Lihat Booking Klien</app-button>
                </a>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="glass-panel p-12 text-center rounded-2xl border border-navy-800 space-y-3">
          <div class="w-14 h-14 rounded-full bg-navy-800 text-white/40 flex items-center justify-center mx-auto">
            <app-icon name="users" size="lg"></app-icon>
          </div>
          <h3 class="text-base font-semibold text-white">Belum ada data klien yang sesuai</h3>
          <p class="text-xs text-white/50 max-w-sm mx-auto">Klien yang melakukan booking atau konsultasi dengan Anda akan otomatis tercatat di direktori ini.</p>
        </div>
      }
    </div>
  `
})
export class ProClientsComponent {
  public readonly proService = inject(ProBookingService);
  public searchQuery = '';

  public readonly filteredClients = computed(() => {
    const list = this.proService.clientRoster();
    const q = this.searchQuery.toLowerCase().trim();

    if (!q) return list;
    return list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q))
    );
  });
}
