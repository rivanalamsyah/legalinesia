import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink, IconComponent, ButtonComponent],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-950 to-navy-900 text-white px-4">
      <div class="text-center max-w-lg">
        <!-- 404 Number -->
        <div class="font-heading text-[10rem] font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-brand-600 mb-4">
          404
        </div>

        <app-icon name="scale" size="xl" className="text-brand-400 mx-auto mb-6"></app-icon>

        <h1 class="font-heading text-3xl font-bold text-white mb-3">Halaman Tidak Ditemukan</h1>
        <p class="text-slate-400 text-base leading-relaxed mb-8">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan. Seperti kasus hukum yang sudah diselesaikan, halaman ini tidak ada lagi di sini.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <app-button routerLink="/" variant="primary" size="lg" icon="arrow-right">
            Kembali ke Beranda
          </app-button>
          <app-button routerLink="/contact" variant="ghost" size="lg">
            Hubungi Support
          </app-button>
        </div>
      </div>
    </div>
  `
})
export class NotFoundPageComponent {}
