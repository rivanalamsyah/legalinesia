import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses()">
      <div *ngIf="hasHeader" class="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
        <ng-content select="[card-header]"></ng-content>
      </div>

      <div class="p-6">
        <ng-content></ng-content>
      </div>

      <div *ngIf="hasFooter" class="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 rounded-b-2xl">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `
})
export class CardComponent {
  @Input() hoverable = false;
  @Input() glass = false;
  @Input() border = true;
  @Input() hasHeader = false;
  @Input() hasFooter = false;
  @Input() className = '';

  public cardClasses = computed(() => {
    const base = 'bg-white rounded-2xl transition-all duration-300 overflow-hidden';
    const borderStyle = this.border ? 'border border-slate-200/80 shadow-sm' : '';
    const hoverStyle = this.hoverable ? 'hover:-translate-y-1 hover:shadow-xl hover:border-brand-200' : '';
    const glassStyle = this.glass ? 'glass-panel' : '';

    return `${base} ${borderStyle} ${hoverStyle} ${glassStyle} ${this.className}`;
  });
}
