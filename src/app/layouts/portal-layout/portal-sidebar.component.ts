import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PortalNavConfig } from '../../core/config/portal-navigation.config';
import { IconComponent } from '../../shared/components/ui/icon/icon.component';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';
import { FirebaseAuthService } from '../../core/firebase/firebase-auth.service';

@Component({
  selector: 'app-portal-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent, BadgeComponent],
  template: `
    <aside
      role="navigation"
      [attr.aria-label]="navConfig.portalTitle"
      class="fixed inset-y-0 left-0 z-40 bg-navy-950 border-r border-navy-800/60 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0"
      [ngClass]="{
        '-translate-x-full': !isMobileOpen,
        'translate-x-0': isMobileOpen,
        'w-64': !isCollapsed,
        'w-20': isCollapsed
      }">

      <!-- Sidebar Header / Logo -->
      <div class="h-16 px-4 flex items-center justify-between border-b border-navy-800/60">
        <a routerLink="/" class="flex items-center gap-2.5 overflow-hidden group" aria-label="Legalinesia - Beranda">
          <img
            src="/logo-legalinesia.png"
            alt="Logo Legalinesia"
            class="h-8 w-auto object-contain shrink-0 transition-transform group-hover:scale-105" />

          @if (!isCollapsed) {
            <div class="flex flex-col whitespace-nowrap">
              <span class="font-heading font-bold text-base text-white leading-none">
                Legal<span class="text-brand-400">inesia</span>
              </span>
              <span class="text-[10px] text-white/50 font-medium tracking-wide uppercase mt-0.5">
                {{ navConfig.portalTitle }}
              </span>
            </div>
          }
        </a>

        <!-- Desktop Collapse Toggle Button -->
        <button
          type="button"
          [attr.aria-label]="isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'"
          class="hidden lg:flex p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          (click)="toggleCollapse.emit()">
          <app-icon [name]="isCollapsed ? 'panel-left-open' : 'panel-left-close'" size="sm"></app-icon>
        </button>

        <!-- Mobile Close Button -->
        <button
          type="button"
          aria-label="Tutup Menu Navigasi"
          class="lg:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          (click)="closeSidebar.emit()">
          <app-icon name="x" size="sm"></app-icon>
        </button>
      </div>

      <!-- Role Ribbon -->
      @if (!isCollapsed) {
        <div class="px-4 py-2.5 bg-white/5 border-b border-navy-800/40 flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span class="text-xs font-semibold text-white/80 truncate">
            {{ navConfig.portalRoleName }}
          </span>
        </div>
      }

      <!-- Nav Items -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Menu navigasi portal">
        @for (item of navConfig.items; track item.id) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-brand-600/20 text-brand-300 font-semibold border-l-2 border-brand-400"
            [routerLinkActiveOptions]="{ exact: false }"
            (click)="closeSidebar.emit()"
            [attr.aria-label]="isCollapsed ? item.label : null"
            [title]="isCollapsed ? item.label : ''"
            class="flex items-center px-3.5 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all group min-h-[44px]"
            [ngClass]="isCollapsed ? 'justify-center' : 'justify-between'">

            <div class="flex items-center gap-3">
              <app-icon [name]="item.iconName" size="sm" className="group-hover:text-brand-400 transition-colors shrink-0"></app-icon>
              @if (!isCollapsed) {
                <span class="whitespace-nowrap">{{ item.label }}</span>
              }
            </div>

            @if (item.badge && !isCollapsed) {
              <app-badge [variant]="item.badgeVariant || 'primary'" size="sm">
                {{ item.badge }}
              </app-badge>
            }
          </a>
        }
      </nav>

      <!-- Sidebar Footer (Website Link & Dedicated Logout Button) -->
      <div class="p-3 border-t border-navy-800/60 space-y-1">
        <a
          routerLink="/"
          [title]="isCollapsed ? 'Kembali ke Website' : ''"
          class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors min-h-[40px]"
          [ngClass]="isCollapsed ? 'justify-center' : ''">
          <app-icon name="arrow-left" size="xs" className="shrink-0"></app-icon>
          @if (!isCollapsed) {
            <span class="whitespace-nowrap">Website Publik</span>
          }
        </a>

        <!-- Logout Button -->
        <button
          type="button"
          (click)="onLogout()"
          [title]="isCollapsed ? 'Keluar Akun' : ''"
          class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all min-h-[40px]"
          [ngClass]="isCollapsed ? 'justify-center' : ''">
          <app-icon name="log-out" size="xs" className="shrink-0"></app-icon>
          @if (!isCollapsed) {
            <span class="whitespace-nowrap">Keluar Akun</span>
          }
        </button>
      </div>

    </aside>
  `
})
export class PortalSidebarComponent {
  @Input({ required: true }) navConfig!: PortalNavConfig;
  @Input() isMobileOpen = false;
  @Input() isCollapsed = false;

  @Output() closeSidebar = new EventEmitter<void>();
  @Output() toggleCollapse = new EventEmitter<void>();

  private readonly firebaseAuth = inject(FirebaseAuthService);

  public async onLogout(): Promise<void> {
    this.closeSidebar.emit();
    await this.firebaseAuth.logout();
  }
}
