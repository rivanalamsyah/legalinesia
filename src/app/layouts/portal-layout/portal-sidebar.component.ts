import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PortalNavConfig } from '../../core/config/portal-navigation.config';
import { IconComponent } from '../../shared/components/ui/icon/icon.component';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';

@Component({
  selector: 'app-portal-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent, BadgeComponent],
  template: `
    <aside
      class="fixed inset-y-0 left-0 z-40 w-64 bg-navy-950 border-r border-navy-800/60 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0"
      [class.-translate-x-full]="!isOpen">

      <!-- Sidebar Header / Logo -->
      <div class="h-16 px-6 flex items-center justify-between border-b border-navy-800/60">
        <a routerLink="/" class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm">
            <app-icon name="scale" size="sm" className="text-white"></app-icon>
          </div>
          <div class="flex flex-col">
            <span class="font-heading font-bold text-base text-white leading-none">
              Legal<span class="text-brand-400">Connect</span>
            </span>
            <span class="text-[10px] text-white/50 font-medium tracking-wide uppercase mt-0.5">
              {{ navConfig.portalTitle }}
            </span>
          </div>
        </a>

        <button
          type="button"
          aria-label="Tutup Menu Navigasi"
          class="lg:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          (click)="closeSidebar.emit()">
          <app-icon name="x" size="sm"></app-icon>
        </button>
      </div>

      <!-- Role Badge Ribbon -->
      <div class="px-4 py-3 bg-white/5 border-b border-navy-800/40 flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        <span class="text-xs font-semibold text-white/80">
          {{ navConfig.portalRoleName }}
        </span>
      </div>

      <!-- Navigation List -->
      <nav aria-label="Portal Navigation" class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        @for (item of navConfig.items; track item.id) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-brand-600/20 text-brand-300 font-semibold border-l-2 border-brand-400"
            [routerLinkActiveOptions]="{ exact: false }"
            (click)="closeSidebar.emit()"
            class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all group">

            <div class="flex items-center gap-3">
              <app-icon [name]="item.iconName" size="sm" className="group-hover:text-brand-400 transition-colors"></app-icon>
              <span>{{ item.label }}</span>
            </div>

            @if (item.badge) {
              <app-badge [variant]="item.badgeVariant || 'primary'" size="sm">
                {{ item.badge }}
              </app-badge>
            }
          </a>
        }
      </nav>

      <!-- Sidebar Footer / Back to Public Website -->
      <div class="p-3 border-t border-navy-800/60">
        <a
          routerLink="/"
          class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors">
          <app-icon name="arrow-left" size="xs"></app-icon>
          <span>Kembali ke Website Publik</span>
        </a>
      </div>

    </aside>
  `
})
export class PortalSidebarComponent {
  @Input({ required: true }) navConfig!: PortalNavConfig;
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();
}
