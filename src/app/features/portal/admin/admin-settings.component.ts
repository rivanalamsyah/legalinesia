import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-white">Pengaturan Platform System</h2>
        <p class="text-xs text-white/60">Konfigurasi variabel sistem global, integrasi Firebase, dan batas sesi RBAC.</p>
      </div>
      <div class="glass-panel p-5 rounded-2xl border border-navy-800 text-xs text-white/70 space-y-2">
        <div class="font-semibold text-white">Status Integrasi Firebase Client</div>
        <p class="text-emerald-400 font-mono">Firebase Auth: ACTIVE | Firestore: ACTIVE | Storage Rules: CONFIGURED</p>
      </div>
    </div>
  `
})
export class AdminSettingsComponent {}
