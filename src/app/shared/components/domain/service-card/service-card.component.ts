import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../ui/icon/icon.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { CurrencyIdrPipe } from '../../../pipes/currency-idr.pipe';
import { LegalService } from '../../../../core/models/legal-service.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, BadgeComponent, CurrencyIdrPipe],
  template: `
    <article class="surface-card p-6 flex flex-col justify-between h-full group hover:border-brand-400">
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
            <app-icon [name]="service.iconName" size="md"></app-icon>
          </div>
          <app-badge variant="brand" size="sm">{{ service.categoryName }}</app-badge>
        </div>

        <h3 class="font-heading font-bold text-lg md:text-xl text-slate-900 group-hover:text-brand-600 transition-colors mb-2">
          {{ service.title }}
        </h3>

        <p class="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
          {{ service.summary || service.description }}
        </p>
      </div>

      <div>
        <div class="border-t border-slate-100 pt-4 flex items-center justify-between">
          <div>
            <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mulai Dari</span>
            <span class="font-heading font-bold text-slate-900 text-lg">
              {{ service.startingPrice | currencyIdr }}
            </span>
          </div>

          <a
            [routerLink]="['/services']"
            [queryParams]="{ serviceId: service.id }"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
            Detail Layanan
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>
      </div>
    </article>
  `
})
export class ServiceCardComponent {
  @Input() service!: LegalService;
}
