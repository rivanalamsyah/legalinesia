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
    <div class="min-h-screen bg-navy-950 text-white flex flex-col font-sans">
      
      <!-- Backdrop for mobile drawer -->
      @if (isMobileSidebarOpen()) {
        <div
          class="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          (click)="closeMobileSidebar()">
        </div>
      }

      <!-- Sidebar -->
      <app-portal-sidebar
        [navConfig]="navConfig()"
        [isOpen]="isMobileSidebarOpen()"
        (closeSidebar)="closeMobileSidebar()">
      </app-portal-sidebar>

      <!-- Main Container Area -->
      <div class="lg:pl-64 flex flex-col flex-1 min-h-screen">
        
        <!-- Header -->
        <app-portal-header
          [title]="navConfig().portalTitle"
          (toggleSidebar)="toggleMobileSidebar()">
        </app-portal-header>

        <!-- Router Outlet Content Area -->
        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <router-outlet></router-outlet>
        </main>

        <!-- Portal Footer -->
        <footer class="py-4 px-6 border-t border-navy-800/40 text-center text-xs text-white/40">
          <p>© 2026 LegalConnect Platform • Hak Akses Terlindungi dengan Sistem RBAC</p>
        </footer>
      </div>

    </div>
  `
})
export class PortalLayoutComponent {
  private readonly authState = inject(AuthStateService);

  public readonly isMobileSidebarOpen = signal<boolean>(false);

  public readonly navConfig = computed(() => {
    return getPortalNavConfigForRole(this.authState.currentRole());
  });

  public toggleMobileSidebar(): void {
    this.isMobileSidebarOpen.update(v => !v);
  }

  public closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }
}
