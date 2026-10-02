import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../ui/container/container.component';
import { SectionHeaderComponent } from '../../ui/section-header/section-header.component';
import { IconComponent } from '../../ui/icon/icon.component';

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-feature-grid',
  standalone: true,
  imports: [CommonModule, ContainerComponent, SectionHeaderComponent, IconComponent],
  template: `
    <section [class]="'section-padding ' + (bg === 'slate' ? 'bg-slate-50' : 'bg-white')">
      <app-container size="lg">
        <app-section-header
          *ngIf="title"
          [title]="title"
          [subtitle]="subtitle"
          [badge]="badge"
          [centered]="true">
        </app-section-header>

        <div [class]="gridClasses">
          <div
            *ngFor="let item of items"
            class="surface-card p-6 md:p-8 flex flex-col justify-between h-full group hover:border-brand-400">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                <app-icon [name]="item.icon" size="md"></app-icon>
              </div>

              <h3 class="font-heading font-bold text-lg md:text-xl text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                {{ item.title }}
              </h3>

              <p class="text-slate-600 text-sm md:text-base leading-relaxed">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </app-container>
    </section>
  `
})
export class FeatureGridComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() badge?: string;
  @Input() items: FeatureItem[] = [];
  @Input() columns: 2 | 3 | 4 = 3;
  @Input() bg: 'white' | 'slate' = 'slate';

  get gridClasses(): string {
    const base = 'grid grid-cols-1 gap-8 mt-12';
    const cols = {
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-2 lg:grid-cols-3',
      4: 'sm:grid-cols-2 lg:grid-cols-4'
    }[this.columns];

    return `${base} ${cols}`;
  }
}
