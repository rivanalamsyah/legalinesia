import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-admin-verifications',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-white">Verifikasi Advokat & Lisensi</h2>
        <p class="text-xs text-white/60">Tinjau permohonan lisensi NIA PERADI/KAI dari advokat yang mendaftar.</p>
      </div>

      <div class="glass-panel p-5 rounded-2xl border border-navy-800 space-y-3">
        <div class="flex items-center justify-between">
          <div class="font-semibold text-white">Hendra Wijaya, S.H., LL.M.</div>
          <span class="text-xs text-amber-400 font-semibold">MENUNGGU VERIFIKASI</span>
        </div>
        <p class="text-xs text-white/60">NIA: PERADI/2017/63910 • Spesialis HKI & Cyber Law</p>
        <div class="flex items-center gap-2 pt-2 border-t border-navy-800">
          <button type="button" class="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors">Setujui & Verifikasi</button>
          <button type="button" class="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs transition-colors">Tolak</button>
        </div>
      </div>
    </div>
  `
})
export class AdminVerificationsComponent {}
