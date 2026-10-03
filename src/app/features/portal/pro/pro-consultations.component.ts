import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';

@Component({
  selector: 'app-pro-consultations',
  standalone: true,
  imports: [CommonModule, IconComponent, BadgeComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-white">Daftar Konsultasi Klien</h2>
        <p class="text-xs text-white/60">Kelola janji temu dan permohonan konsultasi dari klien platform.</p>
      </div>

      <div class="glass-panel p-5 rounded-2xl border border-navy-800 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-brand-400">#BK-202609-082</span>
            <app-badge variant="primary" size="sm">CONFIRMED</app-badge>
          </div>
          <span class="text-xs text-white/60">Senin, 6 Okt 2026 • 14:00 WIB</span>
        </div>
        <div class="text-sm font-semibold text-white">Budi Santoso (Klien Individual)</div>
        <p class="text-xs text-white/60">Topik: Sengketa Perjanjian Kerjasama & Pendirian PT</p>
      </div>
    </div>
  `
})
export class ProConsultationsComponent {}
