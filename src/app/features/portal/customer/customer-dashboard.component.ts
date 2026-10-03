import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { UserProfile } from '../../../core/models/user.model';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, BadgeComponent],
  template: `
    <div class="space-y-6">
      
      <!-- Welcome Header -->
      <div class="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-navy-800">
        <div>
          <span class="text-xs font-semibold uppercase tracking-wider text-brand-400">Portal Klien</span>
          <h2 class="text-2xl font-bold text-white mt-1">
            Selamat Datang, {{ user?.fullName || 'Klien LegalConnect' }}!
          </h2>
          <p class="text-sm text-white/60 mt-1">
            Kelola sesi konsultasi hukum, lacak dokumen permohonan, dan jadwalkan pertemuan dengan advokat terverifikasi.
          </p>
        </div>
        <a
          routerLink="/booking"
          class="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-sm hover:opacity-95 transition-opacity flex items-center gap-2 shadow-lg shadow-brand-600/20">
          <app-icon name="calendar-plus" size="sm"></app-icon>
          <span>Jadwalkan Konsultasi Baru</span>
        </a>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="glass-panel p-5 rounded-xl border border-navy-800 flex items-center justify-between">
          <div>
            <span class="text-xs text-white/50 font-medium">Konsultasi Aktif</span>
            <div class="text-2xl font-bold text-white mt-1">1</div>
            <span class="text-[11px] text-emerald-400 font-medium">Mendatang minggu ini</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <app-icon name="calendar" size="md"></app-icon>
          </div>
        </div>

        <div class="glass-panel p-5 rounded-xl border border-navy-800 flex items-center justify-between">
          <div>
            <span class="text-xs text-white/50 font-medium">Total Konsultasi</span>
            <div class="text-2xl font-bold text-white mt-1">4</div>
            <span class="text-[11px] text-white/40">Selesai 3 sesi</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <app-icon name="check-circle-2" size="md"></app-icon>
          </div>
        </div>

        <div class="glass-panel p-5 rounded-xl border border-navy-800 flex items-center justify-between">
          <div>
            <span class="text-xs text-white/50 font-medium">Dokumen Tersimpan</span>
            <div class="text-2xl font-bold text-white mt-1">6</div>
            <span class="text-[11px] text-white/40">Akta, NIB, & Kontrak</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <app-icon name="file-text" size="md"></app-icon>
          </div>
        </div>

        <div class="glass-panel p-5 rounded-xl border border-navy-800 flex items-center justify-between">
          <div>
            <span class="text-xs text-white/50 font-medium">Status Akun</span>
            <div class="text-lg font-bold text-emerald-400 mt-1">Terverifikasi</div>
            <span class="text-[11px] text-white/40">KTP Terkonfirmasi</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <app-icon name="shield-check" size="md"></app-icon>
          </div>
        </div>

      </div>

      <!-- Content Grid: Upcoming Consultations & Recent Documents -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Active Session Card -->
        <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-white flex items-center gap-2">
              <app-icon name="clock" size="sm" className="text-brand-400"></app-icon>
              <span>Jadwal Konsultasi Mendatang</span>
            </h3>
            <a routerLink="/portal/customer/consultations" class="text-xs text-brand-400 hover:underline">Lihat Semua</a>
          </div>

          <div class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-brand-900 border border-brand-500/30 flex items-center justify-center font-bold text-brand-300">
                  BS
                </div>
                <div>
                  <div class="text-sm font-semibold text-white">Bambang Sutrisno, S.H., M.H.</div>
                  <div class="text-xs text-white/60">Advokat Senior Hukum Bisnis</div>
                </div>
              </div>
              <app-badge variant="primary" size="sm">CONFIRMED</app-badge>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs text-white/70">
              <div class="flex items-center gap-2">
                <app-icon name="calendar" size="xs" className="text-brand-400"></app-icon>
                <span>Senin, 6 Oktober 2026</span>
              </div>
              <div class="flex items-center gap-2">
                <app-icon name="video" size="xs" className="text-brand-400"></app-icon>
                <span>Sesi Online Video (Google Meet)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Info Panel -->
        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
          <h3 class="text-base font-semibold text-white">Panduan Layanan Klien</h3>
          <p class="text-xs text-white/60 leading-relaxed">
            Gunakan portal ini untuk mengakses catatan hasil konsultasi, berkomunikasi secara aman dengan advokat Anda, serta mengunggah berkas hukum yang diperlukan.
          </p>
          <div class="pt-2">
            <a routerLink="/portal/customer/documents" class="text-xs text-brand-400 font-semibold hover:underline flex items-center gap-1">
              <span>Kelola Berkas Hukum Saya</span>
              <app-icon name="chevron-right" size="xs"></app-icon>
            </a>
          </div>
        </div>

      </div>

    </div>
  `
})
export class CustomerDashboardComponent {
  private readonly authState = inject(AuthStateService);
  public get user(): UserProfile | null { return this.authState.currentUser(); }
}
