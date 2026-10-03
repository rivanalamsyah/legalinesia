import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { UserRole } from '../../core/models/role.enum';
import { IconComponent } from '../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-portal-header',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <header class="sticky top-0 z-30 h-16 bg-navy-950/80 backdrop-blur-md border-b border-navy-800/60 px-4 lg:px-8 flex items-center justify-between">
      
      <!-- Left: Mobile Menu Toggle & Title -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          aria-label="Buka Menu Sidebar"
          class="lg:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-brand-400"
          (click)="toggleSidebar.emit()">
          <app-icon name="menu" size="md"></app-icon>
        </button>

        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-brand-400 hidden sm:inline">
            {{ portalRoleLabel }}
          </span>
          <span class="text-white/30 hidden sm:inline">•</span>
          <h1 class="text-sm sm:text-base font-semibold text-white">
            {{ title }}
          </h1>
        </div>
      </div>

      <!-- Right: Actions, Quick Role Switcher (Dev), Notifications, User Profile -->
      <div class="flex items-center gap-3">
        
        <!-- Dev Role Switcher Dropdown (Fast Portal Switcher) -->
        <div class="relative group hidden md:block">
          <button
            type="button"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white/80 transition-colors">
            <app-icon name="user-check" size="xs" className="text-brand-400"></app-icon>
            <span>Ganti Role Demo</span>
            <app-icon name="chevron-down" size="xs" className="text-white/40"></app-icon>
          </button>
          
          <div class="absolute right-0 mt-1 w-48 bg-navy-900 border border-navy-700 rounded-xl shadow-xl py-1 hidden group-hover:block z-50">
            <div class="px-3 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider">Pilih Portal Demo</div>
            <button
              type="button"
              (click)="switchRole(UserRole.CUSTOMER)"
              class="w-full text-left px-3 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/5 flex items-center justify-between">
              <span>Portal Klien</span>
              @if (authState.isCustomer()) { <app-icon name="check" size="xs" className="text-brand-400"></app-icon> }
            </button>
            <button
              type="button"
              (click)="switchRole(UserRole.LEGAL_PRO)"
              class="w-full text-left px-3 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/5 flex items-center justify-between">
              <span>Portal Advokat</span>
              @if (authState.isLegalProfessional()) { <app-icon name="check" size="xs" className="text-brand-400"></app-icon> }
            </button>
            <button
              type="button"
              (click)="switchRole(UserRole.ADMIN)"
              class="w-full text-left px-3 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/5 flex items-center justify-between">
              <span>Admin CMS</span>
              @if (authState.isAdmin()) { <app-icon name="check" size="xs" className="text-brand-400"></app-icon> }
            </button>
          </div>
        </div>

        <!-- Notification Trigger -->
        <button
          type="button"
          aria-label="Notifikasi"
          class="relative p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors">
          <app-icon name="bell" size="sm"></app-icon>
          <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-400"></span>
        </button>

        <!-- Profile & Logout Dropdown -->
        @if (user) {
          <div class="flex items-center gap-3 pl-3 border-l border-navy-800/60">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-navy-700 p-0.5 shadow-sm">
              <img
                [src]="user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'"
                [alt]="user.fullName"
                class="w-full h-full rounded-full object-cover" />
            </div>

            <div class="hidden md:flex flex-col">
              <span class="text-xs font-semibold text-white leading-tight">
                {{ user.fullName }}
              </span>
              <span class="text-[10px] text-white/50">
                {{ user.email }}
              </span>
            </div>

            <button
              type="button"
              (click)="onLogout()"
              title="Keluar Akun"
              aria-label="Keluar Akun"
              class="p-2 rounded-xl text-white/50 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
              <app-icon name="log-out" size="sm"></app-icon>
            </button>
          </div>
        }
      </div>

    </header>
  `
})
export class PortalHeaderComponent {
  @Input() title = 'Dashboard';
  @Output() toggleSidebar = new EventEmitter<void>();

  public readonly authState = inject(AuthStateService);
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

  public switchRole(role: UserRole): void {
    const user = this.authState.loginAsDemo(role);
    const targetRoute = this.authState.getPortalRouteForRole(user.role);
    this.router.navigate([targetRoute]);
  }

  public onLogout(): void {
    this.authState.logout();
    this.router.navigate(['/auth/login']);
  }
}
