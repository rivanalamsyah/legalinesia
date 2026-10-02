import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContainerComponent } from '../../ui/container/container.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule, RouterLink, ContainerComponent, ButtonComponent, IconComponent],
  template: `
    <section class="py-16 md:py-24 bg-gradient-to-br from-brand-900 via-navy-900 to-brand-950 text-white relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none opacity-20">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-gold-500 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-500 rounded-full blur-3xl"></div>
      </div>

      <app-container size="lg" className="relative z-10 text-center">
        <div class="max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <app-icon name="scale" size="xs"></app-icon>
            <span>Konsultasi Instan</span>
          </div>

          <h2 class="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            {{ title }}
          </h2>

          <p class="text-slate-300 text-base md:text-lg leading-relaxed mb-8">
            {{ subtitle }}
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <app-button [routerLink]="primaryRoute" variant="gold" size="lg" icon="calendar">
              {{ primaryLabel }}
            </app-button>

            <app-button [routerLink]="secondaryRoute" variant="ghost" size="lg" className="text-white hover:bg-white/10">
              {{ secondaryLabel }}
            </app-button>
          </div>
        </div>
      </app-container>
    </section>
  `
})
export class CTASectionComponent {
  @Input() title = 'Siap Menyelesaikan Permasalahan Hukum Anda?';
  @Input() subtitle = 'Terhubung langsung dengan advokat berlisensi PERADI dalam hitungan menit. Transparan, aman, dan tanpa biaya tersembunyi.';
  @Input() primaryLabel = 'Jadwalkan Konsultasi';
  @Input() primaryRoute = '/booking';
  @Input() secondaryLabel = 'Pelajari Cara Kerja';
  @Input() secondaryRoute = '/how-it-works';
}
