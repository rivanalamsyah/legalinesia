import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';

@Component({
  selector: 'app-customer-consultations',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, BadgeComponent],
  template: `
    <div class="space-y-6">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-white">Konsultasi Saya</h2>
          <p class="text-xs text-white/60">Riwayat dan jadwal sesi konsultasi hukum Anda bersama advokat.</p>
        </div>
        <a
          routerLink="/booking"
          class="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition-colors flex items-center gap-2">
          <app-icon name="plus" size="xs"></app-icon>
          <span>Konsultasi Baru</span>
        </a>
      </div>

      <!-- Filter Tabs -->
      <div class="flex gap-2 border-b border-navy-800 pb-3">
        <button type="button" class="px-3 py-1.5 rounded-lg bg-brand-500/20 text-brand-300 text-xs font-semibold">Semua Sesi (4)</button>
        <button type="button" class="px-3 py-1.5 rounded-lg hover:bg-white/5 text-white/60 text-xs font-medium">Mendatang (1)</button>
        <button type="button" class="px-3 py-1.5 rounded-lg hover:bg-white/5 text-white/60 text-xs font-medium">Selesai (3)</button>
      </div>

      <!-- Consultations List Table / Cards -->
      <div class="space-y-3">
        <div class="glass-panel p-5 rounded-2xl border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-brand-400">#BK-202609-082</span>
              <app-badge variant="primary" size="sm">CONFIRMED</app-badge>
            </div>
            <h3 class="text-base font-semibold text-white">Sengketa Perjanjian Kerjasama & Kontrak PT</h3>
            <p class="text-xs text-white/60">Advokat: Bambang Sutrisno, S.H., M.H. • Sesi Video Call</p>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-right text-xs">
              <div class="font-semibold text-white">Senin, 6 Okt 2026</div>
              <div class="text-white/50">14:00 - 15:00 WIB</div>
            </div>
            <button type="button" class="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors">
              Detail Sesi
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class CustomerConsultationsComponent {}
