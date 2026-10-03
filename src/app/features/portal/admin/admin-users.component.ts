import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, IconComponent, BadgeComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-white">Kelola Pengguna Platform</h2>
        <p class="text-xs text-white/60">Daftar pengguna terdaftar, peranan RBAC, dan penyesuaian hak akses.</p>
      </div>

      <div class="glass-panel rounded-2xl border border-navy-800 overflow-hidden">
        <table class="w-full text-left text-xs">
          <thead class="bg-white/5 border-b border-navy-800 text-white/60 uppercase">
            <tr>
              <th class="p-3">Pengguna</th>
              <th class="p-3">Role RBAC</th>
              <th class="p-3">Status Email</th>
              <th class="p-3">Tanggal Daftar</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-navy-800 text-white">
            <tr>
              <td class="p-3 font-semibold">Budi Santoso (budi.santoso&#64;example.com)</td>
              <td class="p-3"><app-badge variant="primary" size="sm">CUSTOMER</app-badge></td>
              <td class="p-3 text-emerald-400">Terverifikasi</td>
              <td class="p-3 text-white/60">1 Okt 2026</td>
            </tr>
            <tr>
              <td class="p-3 font-semibold">Bambang Sutrisno, S.H., M.H.</td>
              <td class="p-3"><app-badge variant="gold" size="sm">LEGAL_PRO</app-badge></td>
              <td class="p-3 text-emerald-400">Terverifikasi PERADI</td>
              <td class="p-3 text-white/60">15 Sep 2026</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminUsersComponent {}
