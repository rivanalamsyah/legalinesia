import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCmsService } from '../../../core/services/admin-cms.service';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [
    CommonModule,
    PortalPageHeaderComponent,
    StatusBadgeComponent,
    ButtonComponent,
    IconComponent
  ],
  template: `
    <div class="space-y-8 max-w-5xl">
      <!-- Page Header -->
      <app-portal-page-header
        categoryLabel="Platform Management CMS"
        title="Pengaturan Platform & Audit Logs"
        subtitle="Konfigurasi variabel sistem global, pemantauan integrasi Firebase Auth/Firestore, dan audit trail log keamanan."
        [breadcrumbs]="[{ label: 'Admin CMS', url: '/portal/admin' }, { label: 'Pengaturan System' }]">
        
        <app-status-badge status="ACTIVE" label="ALL SYSTEMS NORMAL"></app-status-badge>
      </app-portal-page-header>

      <!-- System Health Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-white/60 uppercase">Firebase Authentication</span>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div class="text-base font-bold text-white font-heading">Active & Protected</div>
          <p class="text-[11px] text-white/50">Custom Claims & Role Guard Enforced</p>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-white/60 uppercase">Cloud Firestore DB</span>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div class="text-base font-bold text-white font-heading">Security Rules v2</div>
          <p class="text-[11px] text-white/50">Strict Ownership Scoping Enabled</p>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-white/60 uppercase">RBAC Authorization</span>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div class="text-base font-bold text-white font-heading">3 Active Roles</div>
          <p class="text-[11px] text-white/50">CUSTOMER, LEGAL_PRO, ADMIN</p>
        </div>
      </div>

      <!-- Audit Logs Table -->
      <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
        <div class="flex items-center justify-between border-b border-navy-800 pb-3">
          <h3 class="text-base font-semibold text-white font-heading flex items-center gap-2">
            <app-icon name="shield-check" size="sm" class="text-brand-400"></app-icon>
            <span>Platform Security Audit Trail</span>
          </h3>
          <span class="text-xs text-white/50 font-mono">Total {{ adminService.auditLogs().length }} Log Events</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-navy-950/80 border-b border-navy-800 text-white/60 uppercase font-mono">
              <tr>
                <th class="p-3">Waktu</th>
                <th class="p-3">Aksi Log</th>
                <th class="p-3">Target Entitas</th>
                <th class="p-3">Aktor (Admin)</th>
                <th class="p-3">Severity</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-navy-800/80 text-white">
              @for (log of adminService.auditLogs(); track log.id) {
                <tr class="hover:bg-navy-900/50 transition-colors">
                  <td class="p-3 text-white/50 font-mono">{{ log.timestamp }}</td>
                  <td class="p-3 font-mono font-bold text-brand-300">{{ log.action }}</td>
                  <td class="p-3 text-white/90 font-semibold">{{ log.target }}</td>
                  <td class="p-3 text-white/70 font-mono">{{ log.actorEmail }}</td>
                  <td class="p-3">
                    <span
                      class="text-[10px] px-2 py-0.5 rounded font-bold uppercase"
                      [class]="log.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : log.severity === 'WARNING' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-brand-500/10 text-brand-300 border border-brand-500/20'"
                    >
                      {{ log.severity }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminSettingsComponent {
  public readonly adminService = inject(AdminCmsService);
}
