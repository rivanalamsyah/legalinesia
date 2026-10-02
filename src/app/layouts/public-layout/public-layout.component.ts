import { Component, signal, inject, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { PublicHeaderComponent } from './public-header/public-header.component';
import { PublicFooterComponent } from './public-footer/public-footer.component';
import { ToastComponent } from '../../shared/components/ui/toast/toast.component';
import { IconComponent } from '../../shared/components/ui/icon/icon.component';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, PublicHeaderComponent,
    PublicFooterComponent, ToastComponent, IconComponent
  ],
  template: `
    <!-- Skip to main content link for Accessibility -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-brand-600 focus:text-white focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-400">
      Lompati ke konten utama
    </a>

    <!-- Global Route Progress Bar -->
    <div
      *ngIf="loadingService.isLoading() || isNavigating()"
      class="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-gold-400 to-brand-600 z-[100] animate-pulse"
      role="progressbar"
      aria-label="Memuat halaman"></div>

    <!-- Announcement Bar Layer -->
    <div
      *ngIf="showAnnouncement()"
      class="bg-gradient-to-r from-brand-900 via-brand-800 to-navy-900 text-white text-xs md:text-sm py-2 px-4 text-center relative z-50 flex items-center justify-center gap-2 border-b border-white/10">
      <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
      <span class="font-medium">
        Konsultasi Hukum Online 24/7 bersama Advokat PERADI — Respons Cepat & Garansi Transparan.
      </span>
      <button
        type="button"
        class="ml-3 p-1 rounded hover:bg-white/10 transition-colors text-white/70 hover:text-white"
        (click)="dismissAnnouncement()"
        aria-label="Tutup pengumuman">
        <app-icon name="x" size="xs"></app-icon>
      </button>
    </div>

    <!-- Global Navigation Header Shell -->
    <app-public-header></app-public-header>

    <!-- Main Content Shell -->
    <main id="main-content" tabIndex="-1" class="flex-1 focus:outline-none min-h-screen">
      <router-outlet></router-outlet>
    </main>

    <!-- Global Footer Shell -->
    <app-public-footer></app-public-footer>

    <!-- Global Floating Toast Notification Overlay -->
    <app-toast></app-toast>

    <!-- Scroll to Top Button -->
    <button
      *ngIf="showScrollTop()"
      type="button"
      class="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-brand-600 text-white shadow-2xl flex items-center justify-center hover:bg-brand-700 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      (click)="scrollToTop()"
      aria-label="Kembali ke atas">
      <app-icon name="arrow-up" size="md"></app-icon>
    </button>
  `
})
export class PublicLayoutComponent implements OnInit {
  protected readonly loadingService = inject(LoadingService);
  private readonly router = inject(Router);

  public readonly showAnnouncement = signal<boolean>(true);
  public readonly showScrollTop = signal<boolean>(false);
  public readonly isNavigating = signal<boolean>(false);

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigating.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isNavigating.set(false);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });
  }

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      this.showScrollTop.set(window.scrollY > 400);
    }
  }

  public dismissAnnouncement(): void {
    this.showAnnouncement.set(false);
  }

  public scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
