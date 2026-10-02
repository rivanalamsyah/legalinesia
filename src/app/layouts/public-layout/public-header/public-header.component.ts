import { Component, signal, inject, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { PUBLIC_NAVIGATION_CONFIG } from '../../../core/config/navigation.config';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { MegaMenuComponent } from './mega-menu.component';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [
    CommonModule, RouterLink, RouterLinkActive, ButtonComponent,
    IconComponent, ClickOutsideDirective, MegaMenuComponent
  ],
  template: `
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class.glass-header]="isScrolled()"
      [class.shadow-md]="isScrolled()"
      [class.bg-transparent]="!isScrolled()"
      (appClickOutside)="closeAllMenus()">
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20 py-3">
          
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2.5 group" aria-label="LegalConnect - Kembali ke Beranda">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-brand-600/30 shadow-md group-hover:scale-105 transition-transform">
              <app-icon name="scale" size="md" className="text-white"></app-icon>
            </div>
            <span class="font-heading font-bold text-xl md:text-2xl" [class.text-white]="!isScrolled()" [class.text-slate-900]="isScrolled()">
              Legal<span class="text-brand-500">Connect</span>
            </span>
          </a>

          <!-- Desktop Nav -->
          <nav class="hidden lg:flex items-center gap-1" role="navigation" aria-label="Navigasi Utama">
            @for (item of navItems; track item.route) {
              @if (item.route === '/services') {
                <div class="relative" (mouseenter)="openMegaMenu()" (mouseleave)="closeMegaMenu()">
                  <a
                    [routerLink]="item.route"
                    routerLinkActive="text-brand-600 font-semibold"
                    class="px-3.5 py-2 rounded-xl text-sm font-medium transition-colors duration-150 inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-brand-500"
                    [class.text-white]="!isScrolled()"
                    [class.hover:text-brand-600]="isScrolled()"
                    [class.text-slate-700]="isScrolled()">
                    {{ item.label }}
                    <app-icon name="chevron-down" size="xs" class="transition-transform" [class.rotate-180]="isMegaMenuOpen()"></app-icon>
                  </a>
                </div>
              } @else {
                <a
                  [routerLink]="item.route"
                  routerLinkActive="text-brand-600 font-semibold"
                  [routerLinkActiveOptions]="{ exact: item.route === '/' }"
                  class="px-3.5 py-2 rounded-xl text-sm font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand-500"
                  [class.text-white]="!isScrolled()"
                  [class.hover:text-brand-600]="isScrolled()"
                  [class.text-slate-700]="isScrolled()">
                  {{ item.label }}
                </a>
              }
            }
          </nav>

          <!-- Desktop CTA -->
          <div class="hidden lg:flex items-center gap-3">
            @if (authState.isAuthenticated()) {
              <a [routerLink]="dashboardRoute()" class="text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors">
                Dashboard
              </a>
            } @else {
              <a
                [routerLink]="navConfig.authRoutes.login"
                class="text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                [ngClass]="!isScrolled() ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'">
                Masuk
              </a>
              <app-button [routerLink]="navConfig.authRoutes.register" size="md" variant="primary">
                Konsultasi Gratis
              </app-button>
            }
          </div>

          <!-- Mobile Menu Toggle -->
          <button
            id="mobile-menu-toggle"
            type="button"
            class="lg:hidden p-2 rounded-xl transition-colors min-h-touch min-w-touch"
            [ngClass]="!isScrolled() ? 'text-white bg-white/10' : 'text-slate-800 hover:bg-slate-100'"
            (click)="toggleMobileMenu()"
            [attr.aria-expanded]="isMobileMenuOpen()"
            aria-controls="mobile-nav"
            [attr.aria-label]="isMobileMenuOpen() ? 'Tutup menu' : 'Buka menu'">
            <app-icon [name]="isMobileMenuOpen() ? 'x' : 'menu'" size="lg"></app-icon>
          </button>
        </div>
      </div>

      <!-- Mega Menu Dropdown -->
      <div *ngIf="isMegaMenuOpen()" class="hidden lg:block">
        <app-mega-menu (closeMenu)="closeMegaMenu()"></app-mega-menu>
      </div>

      <!-- Mobile Nav Drawer -->
      <div
        id="mobile-nav"
        role="navigation"
        aria-label="Navigasi Mobile"
        [class.hidden]="!isMobileMenuOpen()"
        class="lg:hidden bg-white border-t border-slate-100 shadow-2xl animate-fadeIn">
        
        <nav class="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
          @for (item of navItems; track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-brand-50 text-brand-700 font-semibold"
              [routerLinkActiveOptions]="{ exact: item.route === '/' }"
              class="px-4 py-3 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              (click)="closeAllMenus()">
              {{ item.label }}
            </a>
          }
          <div class="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              [routerLink]="navConfig.authRoutes.login"
              class="px-4 py-3 text-sm text-center font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              (click)="closeAllMenus()">
              Masuk ke Akun
            </a>
            <app-button
              [routerLink]="navConfig.authRoutes.register"
              fullWidth
              size="md"
              (click)="closeAllMenus()">
              Mulai Konsultasi Gratis
            </app-button>
          </div>
        </nav>
      </div>
    </header>
  `
})
export class PublicHeaderComponent {
  protected readonly authState = inject(AuthStateService);
  protected readonly router = inject(Router);
  protected readonly navConfig = PUBLIC_NAVIGATION_CONFIG;
  protected readonly navItems = PUBLIC_NAVIGATION_CONFIG.headerNav;

  public readonly isScrolled = signal<boolean>(false);
  public readonly isMobileMenuOpen = signal<boolean>(false);
  public readonly isMegaMenuOpen = signal<boolean>(false);

  public readonly dashboardRoute = computed<string>(() => {
    if (this.authState.isAdmin()) return '/admin';
    if (this.authState.isLegalProfessional()) return '/legal-pro/dashboard';
    return '/customer/dashboard';
  });

  @HostListener('window:scroll')
  public onScroll(): void {
    if (typeof window !== 'undefined') {
      this.isScrolled.set(window.scrollY > 30);
    }
  }

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  public openMegaMenu(): void {
    this.isMegaMenuOpen.set(true);
  }

  public closeMegaMenu(): void {
    this.isMegaMenuOpen.set(false);
  }

  public closeAllMenus(): void {
    this.isMobileMenuOpen.set(false);
    this.isMegaMenuOpen.set(false);
  }
}
