import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
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
        subtitle="Konfigurasi operasional platform global, pemantauan integrasi Firebase Auth/Firestore, dan audit trail log keamanan."
        [breadcrumbs]="[{ label: 'Admin CMS', url: '/portal/admin' }, { label: 'Pengaturan System' }]">
        
        <app-status-badge status="ACTIVE" label="ALL SYSTEMS NORMAL"></app-status-badge>
      </app-portal-page-header>

      @if (saveSuccess()) {
        <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <app-icon name="check-circle" size="sm"></app-icon>
          <span>Pengaturan platform berhasil disimpan dan diperbarui secara global!</span>
        </div>
      }

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

      <!-- Platform Settings Form -->
      <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
        <div class="border-b border-navy-800 pb-3">
          <h3 class="text-base font-semibold text-white font-heading flex items-center gap-2">
            <app-icon name="settings" size="sm" class="text-brand-400"></app-icon>
            <span>Konfigurasi Operasional Platform</span>
          </h3>
          <p class="text-xs text-white/50 mt-0.5">Pengaturan variabel publik dan toleransi waktu booking</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block text-white/60 mb-1">Nama Situs Platform</label>
            <input type="text" [(ngModel)]="siteName" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white" />
          </div>

          <div>
            <label class="block text-white/60 mb-1">Email Dukungan Bantuan</label>
            <input type="email" [(ngModel)]="supportEmail" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white font-mono" />
          </div>

          <div>
            <label class="block text-white/60 mb-1">Telepon Bantuan Ops</label>
            <input type="text" [(ngModel)]="supportPhone" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white font-mono" />
          </div>

          <div>
            <label class="block text-white/60 mb-1">Notice Period Minimum (Jam Sebelum Booking)</label>
            <input type="number" [(ngModel)]="noticePeriodHours" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white" />
          </div>
        </div>

        <div class="pt-3 border-t border-navy-800 flex justify-end">
          <app-button variant="primary" size="sm" iconLeft="save" (click)="onSaveSettings()">
            Simpan Pengaturan
          </app-button>
        </div>
      </div>

      <!-- Append-Only Audit Logs Table (Read Only) -->
      <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
        <div class="flex items-center justify-between border-b border-navy-800 pb-3">
          <div>
            <h3 class="text-base font-semibold text-white font-heading flex items-center gap-2">
              <app-icon name="shield-check" size="sm" class="text-purple-400"></app-icon>
              <span>Platform Append-Only Audit Logs</span>
            </h3>
            <p class="text-xs text-white/50 mt-0.5">Rekaman mutlak aktivitas admin. Catatan tidak dapat diedit atau dihapus secara bebas.</p>
          </div>
          <span class="text-xs text-white/50 font-mono">Total {{ adminService.auditLogs().length }} Logs</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-navy-950/80 border-b border-navy-800 text-white/60 uppercase font-mono">
              <tr>
                <th class="p-3">Timestamp</th>
                <th class="p-3">Aksi Audit</th>
                <th class="p-3">Target Entitas</th>
                <th class="p-3">Aktor (Admin)</th>
                <th class="p-3">Tingkat Bahaya</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-navy-800/80 text-white">
              @for (log of adminService.auditLogs(); track log.id) {
                <tr class="hover:bg-navy-900/50 transition-colors">
                  <td class="p-3 text-white/50 font-mono">{{ log.timestamp }}</td>
                  <td class="p-3 font-mono font-bold text-purple-300">{{ log.action }}</td>
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

  public saveSuccess = signal<boolean>(false);

  public siteName = this.adminService.settings().siteName;
  public supportEmail = this.adminService.settings().supportEmail;
  public supportPhone = this.adminService.settings().supportPhone;
  public noticePeriodHours = this.adminService.settings().noticePeriodHours;

  public onSaveSettings(): void {
    this.adminService.updatePlatformSettings({
      siteName: this.siteName,
      supportEmail: this.supportEmail,
      supportPhone: this.supportPhone,
      noticePeriodHours: this.noticePeriodHours
    });

    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 4000);
  }
}
