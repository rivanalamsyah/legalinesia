import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { UserProfile } from '../../../core/models/user.model';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';

@Component({
  selector: 'app-pro-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, BadgeComponent],
  template: `
    <div class="space-y-6">
      
      <!-- Welcome Header -->
      <div class="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-navy-800">
        <div>
          <span class="text-xs font-semibold uppercase tracking-wider text-brand-400">Portal Advokat & Partner</span>
          <h2 class="text-2xl font-bold text-white mt-1">
            Selamat Datang, {{ user?.fullName || 'Advokat LegalConnect' }}!
          </h2>
          <p class="text-sm text-white/60 mt-1">
            Kelola jadwal ketersediaan konsultasi, tinjau permintaan klien, buat catatan kasus hukum, dan atur katalog layanan Anda.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <app-badge variant="gold" size="md">VERIFIED LAWYER</app-badge>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="glass-panel p-5 rounded-xl border border-navy-800 flex items-center justify-between">
          <div>
            <span class="text-xs text-white/50 font-medium">Sesi Hari Ini</span>
            <div class="text-2xl font-bold text-white mt-1">3</div>
            <span class="text-[11px] text-emerald-400 font-medium">Terjadwal 14:00 - 17:00</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <app-icon name="calendar-check" size="md"></app-icon>
          </div>
        </div>

        <div class="glass-panel p-5 rounded-xl border border-navy-800 flex items-center justify-between">
          <div>
            <span class="text-xs text-white/50 font-medium">Total Klien Ditangani</span>
            <div class="text-2xl font-bold text-white mt-1">128</div>
            <span class="text-[11px] text-white/40">Rating 4.9 / 5.0</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <app-icon name="users" size="md"></app-icon>
          </div>
        </div>

        <div class="glass-panel p-5 rounded-xl border border-navy-800 flex items-center justify-between">
          <div>
            <span class="text-xs text-white/50 font-medium">Catatan Kasus Selesai</span>
            <div class="text-2xl font-bold text-white mt-1">94</div>
            <span class="text-[11px] text-white/40">Telah dibagikan ke klien</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <app-icon name="notebook-pen" size="md"></app-icon>
          </div>
        </div>

        <div class="glass-panel p-5 rounded-xl border border-navy-800 flex items-center justify-between">
          <div>
            <span class="text-xs text-white/50 font-medium">Tarif Konsultasi</span>
            <div class="text-xl font-bold text-amber-400 mt-1">Rp 350.000</div>
            <span class="text-[11px] text-white/40">Per sesi / jam</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <app-icon name="briefcase" size="md"></app-icon>
          </div>
        </div>

      </div>

      <!-- Quick Actions Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3">
          <h3 class="text-base font-semibold text-white">Atur Jadwal & Ketersediaan</h3>
          <p class="text-xs text-white/60">Tentukan slot jam dan hari kerja tempat klien dapat melakukan booking.</p>
          <a routerLink="/portal/pro/schedule" class="inline-flex items-center gap-1.5 text-xs text-brand-400 font-semibold hover:underline">
            <span>Kelola Jadwal Ketersediaan</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3">
          <h3 class="text-base font-semibold text-white">Tulis Catatan Konsultasi</h3>
          <p class="text-xs text-white/60">Dokumentasikan ringkasan nasihat hukum dan langkah selanjutnya pasca sesi.</p>
          <a routerLink="/portal/pro/case-notes" class="inline-flex items-center gap-1.5 text-xs text-brand-400 font-semibold hover:underline">
            <span>Buat Catatan Baru</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3">
          <h3 class="text-base font-semibold text-white">Kelola Layanan Hukum</h3>
          <p class="text-xs text-white/60">Perbarui rincian spesialisasi, cakupan layanan, dan tarif konsultasi Anda.</p>
          <a routerLink="/portal/pro/services" class="inline-flex items-center gap-1.5 text-xs text-brand-400 font-semibold hover:underline">
            <span>Sunting Katalog Layanan</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>
      </div>

    </div>
  `
})
export class ProDashboardComponent {
  private readonly authState = inject(AuthStateService);
  public get user(): UserProfile | null { return this.authState.currentUser(); }
}
