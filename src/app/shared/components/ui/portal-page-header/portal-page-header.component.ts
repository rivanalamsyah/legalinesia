import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { BreadcrumbItem } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-portal-page-header',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="space-y-2 mb-6">
      
      <!-- Breadcrumb Nav -->
      @if (breadcrumbs && breadcrumbs.length > 0) {
        <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-xs text-white/50">
          <a routerLink="/" class="hover:text-white transition-colors">Utama</a>
          @for (item of breadcrumbs; track item.label) {
            <app-icon name="chevron-right" size="xs" className="text-white/30"></app-icon>
            @if (item.url) {
              <a [routerLink]="item.url" class="hover:text-white transition-colors">{{ item.label }}</a>
            } @else {
              <span class="text-brand-300 font-medium">{{ item.label }}</span>
            }
          }
        </nav>
      }

      <!-- Page Title & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          @if (categoryLabel) {
            <span class="text-[11px] font-bold uppercase tracking-wider text-brand-400 block mb-0.5">
              {{ categoryLabel }}
            </span>
          }
          <h1 class="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            {{ title }}
          </h1>
          @if (subtitle) {
            <p class="text-xs sm:text-sm text-white/60 mt-1 max-w-3xl leading-relaxed">
              {{ subtitle }}
            </p>
          }
        </div>

        <!-- Projected Action Buttons / CTA Area -->
        <div class="flex items-center gap-2 shrink-0">
          <ng-content></ng-content>
        </div>
      </div>

    </div>
  `
})
export class PortalPageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() categoryLabel?: string;
  @Input() breadcrumbs: BreadcrumbItem[] = [];
}
