import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'primary' | 'brand' | 'gold' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span [class]="badgeClasses()"><ng-content></ng-content></span>`
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';
  @Input() size: 'sm' | 'md' = 'sm';
  @Input() className = '';

  public badgeClasses = computed(() => {
    const base = 'inline-flex items-center font-medium tracking-wide rounded-full whitespace-nowrap';
    const sizes = { sm: 'px-2.5 py-0.5 text-xs', md: 'px-3.5 py-1 text-xs' }[this.size];
    const variants: Record<BadgeVariant, string> = {
      primary: 'bg-brand-100 text-brand-800',
      brand: 'bg-brand-100 text-brand-800',
      gold: 'bg-gold-100 text-gold-700',
      success: 'bg-emerald-100 text-emerald-700',
      warning: 'bg-amber-100 text-amber-700',
      danger: 'bg-red-100 text-red-700',
      neutral: 'bg-slate-100 text-slate-600',
      outline: 'border border-slate-300 text-slate-600 bg-transparent'
    };
    return `${base} ${sizes} ${variants[this.variant]} ${this.className}`;
  });
}
