import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-white">Kelola Konten CMS</h2>
        <p class="text-xs text-white/60">Kelola daftar layanan hukum, artikel insight, dan pertanyaan FAQ.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="glass-panel p-5 rounded-2xl border border-navy-800 space-y-2">
          <h3 class="text-sm font-semibold text-white">Katalog Layanan Hukum</h3>
          <p class="text-xs text-white/50">3 Kategori Layanan Publik Active</p>
        </div>
        <div class="glass-panel p-5 rounded-2xl border border-navy-800 space-y-2">
          <h3 class="text-sm font-semibold text-white">Artikel Insight & Edukasi</h3>
          <p class="text-xs text-white/50">24 Artikel Terpublikasi</p>
        </div>
        <div class="glass-panel p-5 rounded-2xl border border-navy-800 space-y-2">
          <h3 class="text-sm font-semibold text-white">Pusat FAQ Platform</h3>
          <p class="text-xs text-white/50">12 FAQ Aktif</p>
        </div>
      </div>
    </div>
  `
})
export class AdminContentComponent {}
