import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  active?: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <nav aria-label="Breadcrumb" class="py-3">
      <ol class="flex items-center flex-wrap gap-2 text-xs md:text-sm text-slate-500">
        <li>
          <a routerLink="/" class="flex items-center hover:text-brand-600 transition-colors" aria-label="Beranda">
            <app-icon name="home" size="xs"></app-icon>
          </a>
        </li>
        <li *ngFor="let item of items; let last = last" class="flex items-center gap-2">
          <app-icon name="chevron-right" size="xs" class="text-slate-300"></app-icon>
          <a *ngIf="item.url && !last" [routerLink]="item.url" class="hover:text-brand-600 transition-colors font-medium">
            {{ item.label }}
          </a>
          <span *ngIf="!item.url || last" class="font-semibold text-slate-900" aria-current="page">
            {{ item.label }}
          </span>
        </li>
      </ol>
    </nav>
  `
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}
