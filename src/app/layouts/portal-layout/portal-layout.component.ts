import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { getPortalNavConfigForRole } from '../../core/config/portal-navigation.config';
import { PortalSidebarComponent } from './portal-sidebar.component';
import { PortalHeaderComponent } from './portal-header.component';

@Component({
  selector: 'app-portal-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PortalSidebarComponent,
    PortalHeaderComponent
  ],
  template: `
    <div class="min-h-screen bg-navy-950 text-white flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      
      <!-- Backdrop overlay for mobile drawer -->
      @if (isMobileSidebarOpen()) {
        <div
          class="fixed inset-0 z-30 bg-navy-950/80 backdrop-blur-sm lg:hidden transition-opacity"
          (click)="closeMobileSidebar()">
        </div>
      }

      <!-- Sidebar -->
      <app-portal-sidebar
        [navConfig]="navConfig()"
        [isMobileOpen]="isMobileSidebarOpen()"
        [isCollapsed]="isDesktopCollapsed()"
        (closeSidebar)="closeMobileSidebar()"
        (toggleCollapse)="toggleDesktopCollapse()">
      </app-portal-sidebar>

      <!-- Main Container Area -->
      <div
        class="flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out"
        [ngClass]="isDesktopCollapsed() ? 'lg:pl-20' : 'lg:pl-64'">
        
        <!-- Header Topbar -->
        <app-portal-header
          [title]="navConfig().portalTitle"
          (toggleSidebar)="toggleSidebarAction()">
        </app-portal-header>

        <!-- Main Content Container -->
        <main id="main-content" class="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-fade-in">
          <router-outlet></router-outlet>
        </main>

        <!-- Portal Dashboard Footer -->
        <footer class="py-4 px-6 border-t border-navy-800/40 text-center text-xs text-white/40">
          <p>© 2026 Legalinesia Platform • System RBAC Active • Encrypted Legal Workspace</p>
        </footer>
      </div>

    </div>
  `
})
export class PortalLayoutComponent {
  private readonly authState = inject(AuthStateService);

  public readonly isMobileSidebarOpen = signal<boolean>(false);
  public readonly isDesktopCollapsed = signal<boolean>(false);

  public readonly navConfig = computed(() => {
    return getPortalNavConfigForRole(this.authState.currentRole());
  });

  public toggleSidebarAction(): void {
    // If mobile, toggle drawer. If desktop, toggle collapse.
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      this.isMobileSidebarOpen.update(v => !v);
    } else {
      this.isDesktopCollapsed.update(v => !v);
    }
  }

  public toggleDesktopCollapse(): void {
    this.isDesktopCollapsed.update(v => !v);
  }

  public closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }
}
