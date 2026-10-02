import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-mega-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="w-full bg-white border-b border-slate-200 shadow-xl py-8 px-6 animate-fadeIn">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <!-- Category 1: Perdata & Bisnis -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-brand-600 mb-4 flex items-center gap-2">
            <app-icon name="building-2" size="xs"></app-icon>
            Hukum Perdata & Bisnis
          </h4>
          <ul class="space-y-3 text-sm">
            <li>
              <a routerLink="/services" [queryParams]="{ cat: 'Pendirian PT/CV' }" (click)="close()" class="text-slate-700 hover:text-brand-600 font-medium block transition-colors">
                Pendirian PT / CV / PMA
              </a>
            </li>
            <li>
              <a routerLink="/services" [queryParams]="{ cat: 'Kontrak' }" (click)="close()" class="text-slate-700 hover:text-brand-600 block transition-colors">
                Draf & Review Kontrak Bisnis
              </a>
            </li>
            <li>
              <a routerLink="/services" [queryParams]="{ cat: 'HKI' }" (click)="close()" class="text-slate-700 hover:text-brand-600 block transition-colors">
                Hak Kekayaan Intelektual (HKI)
              </a>
            </li>
          </ul>
        </div>

        <!-- Category 2: Keluarga & Pertanahan -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-brand-600 mb-4 flex items-center gap-2">
            <app-icon name="users" size="xs"></app-icon>
            Hukum Keluarga & Properti
          </h4>
          <ul class="space-y-3 text-sm">
            <li>
              <a routerLink="/services" [queryParams]="{ cat: 'Perceraian' }" (click)="close()" class="text-slate-700 hover:text-brand-600 font-medium block transition-colors">
                Perceraian & Hak Asuh Anak
              </a>
            </li>
            <li>
              <a routerLink="/services" [queryParams]="{ cat: 'Waris' }" (click)="close()" class="text-slate-700 hover:text-brand-600 block transition-colors">
                Pembagian Waris & Hibah
              </a>
            </li>
            <li>
              <a routerLink="/services" [queryParams]="{ cat: 'Pertanahan' }" (click)="close()" class="text-slate-700 hover:text-brand-600 block transition-colors">
                Sengketa Tanah & Properti
              </a>
            </li>
          </ul>
        </div>

        <!-- Category 3: Pidana & Ketenagakerjaan -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-brand-600 mb-4 flex items-center gap-2">
            <app-icon name="shield" size="xs"></app-icon>
            Pidana & Ketenagakerjaan
          </h4>
          <ul class="space-y-3 text-sm">
            <li>
              <a routerLink="/services" [queryParams]="{ cat: 'Pidana' }" (click)="close()" class="text-slate-700 hover:text-brand-600 font-medium block transition-colors">
                Pendampingan Kasus Pidana
              </a>
            </li>
            <li>
              <a routerLink="/services" [queryParams]="{ cat: 'Ketenagakerjaan' }" (click)="close()" class="text-slate-700 hover:text-brand-600 block transition-colors">
                Perselisihan Hubungan Industrial
              </a>
            </li>
            <li>
              <a routerLink="/services" [queryParams]="{ cat: 'Somasi' }" (click)="close()" class="text-slate-700 hover:text-brand-600 block transition-colors">
                Pembuatan Somasi Hukum
              </a>
            </li>
          </ul>
        </div>

        <!-- Featured CTA Box -->
        <div class="bg-gradient-to-br from-brand-900 to-navy-900 text-white rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div class="inline-block bg-gold-500/20 text-gold-400 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
              Konsultasi Instan
            </div>
            <h5 class="font-heading font-bold text-base mb-1">Butuh Advokat Segera?</h5>
            <p class="text-slate-300 text-xs leading-relaxed mb-4">
              Terhubung dengan advokat spesialis berlisensi dalam kurang dari 15 menit.
            </p>
          </div>
          <a
            routerLink="/professionals"
            (click)="close()"
            class="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors">
            Cari Advokat Sekarang
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>

      </div>
    </div>
  `
})
export class MegaMenuComponent {
  @Output() closeMenu = new EventEmitter<void>();

  public close(): void {
    this.closeMenu.emit();
  }
}
