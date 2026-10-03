import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-pro-case-notes',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-white">Catatan Kasus & Consultation Notes</h2>
          <p class="text-xs text-white/60">Dokumentasi hasil konsultasi dan legal opinion untuk klien Anda.</p>
        </div>
        <button type="button" class="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition-colors flex items-center gap-2">
          <app-icon name="plus" size="xs"></app-icon>
          <span>Buat Catatan Baru</span>
        </button>
      </div>

      <div class="glass-panel p-5 rounded-2xl border border-navy-800 space-y-2">
        <h3 class="text-sm font-semibold text-white">Ringkasan Legal Opinion PT Nusantara Karya</h3>
        <p class="text-xs text-white/60">Klien: Budi Santoso • Dibuat: 4 Okt 2026</p>
      </div>
    </div>
  `
})
export class ProCaseNotesComponent {}
