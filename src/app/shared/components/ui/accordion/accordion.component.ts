import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  isOpen?: boolean;
}

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="space-y-4">
      <div
        *ngFor="let item of items"
        class="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all duration-200"
        [class.shadow-sm]="item.isOpen">
        
        <h3>
          <button
            type="button"
            class="w-full px-6 py-5 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-2xl"
            [attr.aria-expanded]="item.isOpen"
            [attr.aria-controls]="'accordion-content-' + item.id"
            (click)="toggle(item)">
            <span class="font-heading font-semibold text-base md:text-lg text-slate-900 pr-4">
              {{ item.title }}
            </span>
            <span class="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 transition-transform duration-200"
              [class.rotate-180]="item.isOpen"
              [class.bg-brand-50]="item.isOpen"
              [class.text-brand-600]="item.isOpen">
              <app-icon name="chevron-down" size="sm"></app-icon>
            </span>
          </button>
        </h3>

        <div
          [id]="'accordion-content-' + item.id"
          *ngIf="item.isOpen"
          class="px-6 pb-6 pt-1 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100 animate-fadeIn">
          {{ item.content }}
        </div>
      </div>
    </div>
  `
})
export class AccordionComponent {
  @Input() items: AccordionItem[] = [];
  @Input() allowMultiple = false;

  public toggle(targetItem: AccordionItem): void {
    if (!this.allowMultiple) {
      this.items.forEach(item => {
        if (item.id !== targetItem.id) {
          item.isOpen = false;
        }
      });
    }
    targetItem.isOpen = !targetItem.isOpen;
  }
}
