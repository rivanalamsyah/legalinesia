import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../ui/container/container.component';
import { BadgeComponent } from '../../ui/badge/badge.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, ContainerComponent, BadgeComponent],
  template: `
    <section class="relative pt-32 pb-20 bg-gradient-to-br from-navy-950 via-brand-900 to-navy-900 text-white overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-20 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 left-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl"></div>
      </div>

      <app-container size="lg" className="relative z-10">
        <div class="max-w-3xl">
          <app-badge *ngIf="badge" variant="gold" size="md" className="mb-4">
            {{ badge }}
          </app-badge>

          <h1 class="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            {{ title }}
          </h1>

          <p *ngIf="subtitle" class="text-slate-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
            {{ subtitle }}
          </p>

          <div class="flex flex-wrap items-center gap-4">
            <ng-content select="[hero-actions]"></ng-content>
          </div>
        </div>
      </app-container>
    </section>
  `
})
export class HeroSectionComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() badge?: string;
}
