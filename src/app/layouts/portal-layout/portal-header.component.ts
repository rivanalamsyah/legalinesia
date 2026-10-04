import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { FirebaseAuthService } from '../../core/firebase/firebase-auth.service';
import { UserRole } from '../../core/models/role.enum';
import { IconComponent } from '../../shared/components/ui/icon/icon.component';
import { DropdownMenuComponent, DropdownMenuItem } from '../../shared/components/ui/dropdown/dropdown-menu.component';

@Component({
  selector: 'app-portal-header',
  standalone: true,
  imports: [CommonModule, IconComponent, DropdownMenuComponent],
  template: `
    <header class="sticky top-0 z-30 h-16 bg-navy-950/80 backdrop-blur-md border-b border-navy-800/60 px-4 lg:px-8 flex items-center justify-between">
      
      <!-- Left: Sidebar Toggle Button & Dynamic Page Title -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          aria-label="Toggle Navigation Sidebar"
          class="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-brand-400 transition-colors"
          (click)="toggleSidebar.emit()">
          <app-icon name="menu" size="md"></app-icon>
        </button>

        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-brand-400 hidden sm:inline">
            {{ portalRoleLabel }}
          </span>
          <span class="text-white/30 hidden sm:inline">•</span>
          <h1 class="text-sm sm:text-base font-semibold text-white font-heading">
            {{ title }}
          </h1>
        </div>
      </div>

      <!-- Right: Notifications, User Profile & Quick Logout Button -->
      <div class="flex items-center gap-3">

        <!-- Notification Bell Dropdown -->
        <app-dropdown-menu
          headerTitle="Notifikasi Sistem"
          [items]="notificationItems"
          (selectItem)="onSelectNotification($event)">
          <button
            trigger
            type="button"
            aria-label="Notifikasi Sistem"
            class="relative p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <app-icon name="bell" size="sm"></app-icon>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-400"></span>
          </button>
        </app-dropdown-menu>

        <!-- User Profile Dropdown -->
        @if (user) {
          <app-dropdown-menu
            [headerTitle]="user.fullName"
            [items]="userMenuItems"
            (selectItem)="onSelectUserItem($event)">
            <button
              trigger
              type="button"
              class="flex items-center gap-2.5 pl-3 border-l border-navy-800/60 group">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-navy-700 p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                <img
                  [src]="user.avatarUrl || '/images/avatars/avatar-customer-default.svg'"
                  [alt]="user.fullName"
                  class="w-full h-full rounded-full object-cover" />
              </div>

              <div class="hidden md:flex flex-col text-left">
                <span class="text-xs font-semibold text-white leading-tight">
                  {{ user.fullName }}
                </span>
                <span class="text-[10px] text-white/50">
                  {{ user.email }}
                </span>
              </div>

              <app-icon name="chevron-down" size="xs" className="text-white/40 hidden md:block"></app-icon>
            </button>
          </app-dropdown-menu>
        }

        <!-- Direct Logout Action Button -->
        <button
          type="button"
          (click)="onDirectLogout()"
          title="Keluar Akun (Logout)"
          aria-label="Keluar Akun"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-all">
          <app-icon name="log-out" size="xs"></app-icon>
          <span class="hidden sm:inline">Keluar</span>
        </button>

      </div>

    </header>
  `
})
export class PortalHeaderComponent {
  @Input() title = 'Dashboard';
  @Output() toggleSidebar = new EventEmitter<void>();

  public readonly authState = inject(AuthStateService);
  private readonly firebaseAuth = inject(FirebaseAuthService);
  private readonly router = inject(Router);
  public readonly UserRole = UserRole;

  public get user() {
    return this.authState.currentUser();
  }

  public get portalRoleLabel(): string {
    const role = this.authState.currentRole();
    switch (role) {
      case UserRole.LEGAL_PRO:
        return 'Advokat Portal';
      case UserRole.ADMIN:
        return 'Admin CMS';
      case UserRole.CUSTOMER:
      default:
        return 'Klien Portal';
    }
  }

  public notificationItems: DropdownMenuItem[] = [
    { id: 'notif-1', label: 'Selamat datang di Legalinesia', iconName: 'bell' }
  ];

  public userMenuItems: DropdownMenuItem[] = [
    { id: 'profile', label: 'Pengaturan Profil', iconName: 'user' },
    { id: 'about', label: 'Tentang Kami & FAQ', iconName: 'help-circle' },
    { id: 'logout', label: 'Keluar Akun', iconName: 'log-out', danger: true, divider: true }
  ];

  public onSelectNotification(item: DropdownMenuItem): void {
    // Handle notification action
  }

  public async onDirectLogout(): Promise<void> {
    await this.firebaseAuth.logout();
  }

  public async onSelectUserItem(item: DropdownMenuItem): Promise<void> {
    if (item.id === 'logout') {
      await this.firebaseAuth.logout();
    } else if (item.id === 'profile') {
      const role = this.authState.currentRole();
      const route = this.authState.getPortalRouteForRole(role) + '/profile';
      this.router.navigate([route]);
    } else if (item.id === 'about') {
      this.router.navigate(['/about']);
    }
  }
}
