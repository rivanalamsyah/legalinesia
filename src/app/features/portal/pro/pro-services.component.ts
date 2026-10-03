import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-pro-services',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-white">Katalog Layanan Hukum Saya</h2>
        <p class="text-xs text-white/60">Atur harga, cakupan, dan estimasi pengerjaan paket layanan hukum Anda.</p>
      </div>

      <div class="glass-panel p-5 rounded-2xl border border-navy-800 space-y-2">
        <h3 class="text-sm font-semibold text-white">Pendirian PT & Pengurusan NIB OSS</h3>
        <p class="text-xs text-white/60">Tarif Flat Rate: Rp 2.500.000 • Durasi 3-5 Hari Kerja</p>
      </div>
    </div>
  `
})
export class ProServicesComponent {}
