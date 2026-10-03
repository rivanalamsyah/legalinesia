import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCmsService } from '../../../core/services/admin-cms.service';
import { UserRole } from '../../../core/models/role.enum';
import { CustomerProfile, LegalProfessionalProfile } from '../../../core/models/user.model';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { ConfirmationDialogComponent } from '../../../shared/components/ui/confirmation-dialog/confirmation-dialog.component';

export interface AdminDisplayUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
  isActive: boolean;
  extraInfo: string;
  original: CustomerProfile | LegalProfessionalProfile;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PortalPageHeaderComponent,
    StatusBadgeComponent,
    BadgeComponent,
    ButtonComponent,
    IconComponent,
    ConfirmationDialogComponent
  ],
  template: `
    <div class="space-y-8">
      <!-- Page Header -->
      <app-portal-page-header
        categoryLabel="Platform Management CMS"
        title="Manajemen Pengguna Platform"
        subtitle="Kelola direktori pengguna terdaftar (Klien dan Advokat Partner), peranan RBAC, serta status keaktifan akun."
        [breadcrumbs]="[{ label: 'Admin CMS', url: '/portal/admin' }, { label: 'Kelola Pengguna' }]">
        
        <div class="text-xs text-white/60 bg-navy-900 border border-navy-800 px-3 py-1.5 rounded-lg font-mono">
          Total {{ combinedUsers().length }} Pengguna Terdaftar
        </div>
      </app-portal-page-header>

      <!-- Search & Filter Controls -->
      <div class="glass-panel p-4 rounded-2xl border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Search input -->
        <div class="relative flex-1 max-w-md">
          <app-icon name="search" size="xs" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"></app-icon>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Cari nama pengguna, email, atau nomor telepon..."
            class="w-full bg-navy-950/80 border border-navy-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-brand-500"
          />
        </div>

        <!-- Role Filter Tabs -->
        <div class="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0">
          @for (tab of roleTabs; track tab.value) {
            <button
              (click)="selectedRoleFilter.set(tab.value)"
              [class]="selectedRoleFilter() === tab.value
                ? 'px-3 py-1.5 rounded-lg bg-brand-500 text-white font-semibold text-xs transition-all shadow-sm'
                : 'px-3 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-navy-800/60 font-medium text-xs transition-all'"
            >
              {{ tab.label }}
            </button>
          }
        </div>
      </div>

      <!-- Users Table -->
      @if (filteredUsers().length > 0) {
        <div class="glass-panel rounded-2xl border border-navy-800 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-navy-950/80 border-b border-navy-800 text-white/60 uppercase font-mono">
                <tr>
                  <th class="p-3.5">Pengguna / Email</th>
                  <th class="p-3.5">Peranan RBAC</th>
                  <th class="p-3.5">Detail / Lisensi</th>
                  <th class="p-3.5">Status Akun</th>
                  <th class="p-3.5">Tanggal Pendaftaran</th>
                  <th class="p-3.5 text-right">Aksi Ops</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-navy-800/80 text-white">
                @for (user of filteredUsers(); track user.id) {
                  <tr class="hover:bg-navy-900/50 transition-colors">
                    <td class="p-3.5">
                      <div class="font-semibold text-white">{{ user.fullName }}</div>
                      <div class="text-white/50 font-mono text-[11px]">{{ user.email }}</div>
                    </td>
                    <td class="p-3.5">
                      <app-badge [variant]="user.role === 'LEGAL_PRO' ? 'gold' : user.role === 'ADMIN' ? 'warning' : 'primary'" size="sm">
                        {{ user.role }}
                      </app-badge>
                    </td>
                    <td class="p-3.5 text-white/70 max-w-[200px] truncate">
                      {{ user.extraInfo }}
                    </td>
                    <td class="p-3.5">
                      <span
                        class="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
                        [class]="user.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'"
                      >
                        {{ user.isActive ? 'Aktif' : 'Non-Aktif / Suspend' }}
                      </span>
                    </td>
                    <td class="p-3.5 text-white/50 font-mono">
                      {{ user.createdAt | date:'dd MMM yyyy' }}
                    </td>
                    <td class="p-3.5 text-right space-x-2">
                      <app-button
                        [variant]="user.isActive ? 'danger' : 'primary'"
                        size="xs"
                        (click)="confirmToggleActive(user)"
                      >
                        {{ user.isActive ? 'Suspend' : 'Aktifkan' }}
                      </app-button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      } @else {
        <div class="glass-panel p-12 text-center rounded-2xl border border-navy-800 space-y-3">
          <div class="w-14 h-14 rounded-full bg-navy-800 text-white/40 flex items-center justify-center mx-auto">
            <app-icon name="users" size="lg"></app-icon>
          </div>
          <h3 class="text-base font-semibold text-white">Tidak ada pengguna yang sesuai</h3>
          <p class="text-xs text-white/50 max-w-sm mx-auto">Tidak ada akun pengguna yang memenuhi kriteria pencarian atau filter peranan.</p>
        </div>
      }

      <!-- Status Toggle Confirmation Dialog -->
      <app-confirmation-dialog
        [isOpen]="selectedUserForToggle !== null"
        [title]="selectedUserForToggle?.isActive ? 'Suspend Akun Pengguna?' : 'Aktifkan Akun Pengguna?'"
        [message]="'Apakah Anda yakin ingin mengubah status keaktifan akun milik ' + (selectedUserForToggle?.fullName || '') + '?'"
        [confirmText]="selectedUserForToggle?.isActive ? 'Suspend Akun' : 'Aktifkan Akun'"
        [variant]="selectedUserForToggle?.isActive ? 'danger' : 'info'"
        (confirm)="onConfirmToggleUser()"
        (cancel)="selectedUserForToggle = null">
      </app-confirmation-dialog>

    </div>
  `
})
export class AdminUsersComponent {
  public readonly adminService = inject(AdminCmsService);

  public searchQuery = '';
  public selectedRoleFilter = signal<string>('ALL');
  public selectedUserForToggle: AdminDisplayUser | null = null;

  public readonly roleTabs = [
    { label: 'Semua Pengguna', value: 'ALL' },
    { label: 'Klien (CUSTOMER)', value: UserRole.CUSTOMER },
    { label: 'Advokat (LEGAL_PRO)', value: UserRole.LEGAL_PRO }
  ];

  public readonly combinedUsers = computed<AdminDisplayUser[]>(() => {
    const custs: AdminDisplayUser[] = this.adminService.customers().map(c => ({
      id: c.id,
      fullName: c.fullName,
      email: c.email,
      role: c.role,
      phone: c.phoneNumber,
      createdAt: c.createdAt,
      isActive: c.isActive ?? true,
      extraInfo: `Tipe: ${c.customerType || 'INDIVIDUAL'} (${c.city || 'Kota -'})`,
      original: c
    }));

    const pros: AdminDisplayUser[] = this.adminService.professionals().map(p => ({
      id: p.id,
      fullName: p.fullName,
      email: p.email,
      role: p.role,
      createdAt: p.createdAt,
      isActive: p.isActive ?? true,
      extraInfo: `NIA: ${p.barLicenseNumber || 'Belum Verifikasi'} (${p.isVerified ? 'VERIFIED' : 'PENDING'})`,
      original: p
    }));

    return [...custs, ...pros];
  });

  public readonly filteredUsers = computed(() => {
    let list = this.combinedUsers();
    const role = this.selectedRoleFilter();
    const q = this.searchQuery.toLowerCase().trim();

    if (role !== 'ALL') {
      list = list.filter(u => u.role === role);
    }

    if (q) {
      list = list.filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q))
      );
    }

    return list;
  });

  public confirmToggleActive(user: AdminDisplayUser): void {
    this.selectedUserForToggle = user;
  }

  public onConfirmToggleUser(): void {
    if (this.selectedUserForToggle) {
      this.adminService.toggleUserActive(this.selectedUserForToggle.id);
      this.selectedUserForToggle = null;
    }
  }
}
