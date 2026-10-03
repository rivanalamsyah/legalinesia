import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-customer-documents',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-white">Dokumen Hukum Saya</h2>
        <p class="text-xs text-white/60">Vault penyimpanan aman berkas hukum, draft kontrak, dan salinan akta.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="glass-panel p-5 rounded-2xl border border-navy-800 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <app-icon name="file-text" size="sm"></app-icon>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-white">Draft Akta Pendirian PT.pdf</h3>
            <p class="text-xs text-white/50">Diunggah 2 hari lalu • 2.4 MB</p>
          </div>
          <div class="pt-2 flex items-center justify-between text-xs border-t border-navy-800">
            <span class="text-emerald-400 font-medium">Terverifikasi Notaris</span>
            <button type="button" class="text-brand-400 hover:underline">Unduh</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CustomerDocumentsComponent {}
