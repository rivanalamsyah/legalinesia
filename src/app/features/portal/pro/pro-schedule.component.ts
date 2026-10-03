import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-pro-schedule',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-white">Jadwal & Ketersediaan Konsultasi</h2>
        <p class="text-xs text-white/60">Atur slot jam dan hari kerja untuk janji temu klien.</p>
      </div>

      <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
        <h3 class="text-base font-semibold text-white">Slot Jam Kerja Mingguan</h3>
        <div class="space-y-2">
          <div class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
            <span class="font-semibold text-white">Senin - Jumat</span>
            <span class="text-brand-300">09:00 - 17:00 WIB</span>
            <span class="text-emerald-400 font-medium">Aktif Menerima Booking</span>
          </div>
          <div class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
            <span class="font-semibold text-white">Sabtu</span>
            <span class="text-brand-300">10:00 - 14:00 WIB</span>
            <span class="text-amber-400 font-medium">Khusus Sesi Online</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProScheduleComponent {}
