import { Component, Input, Output, EventEmitter, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      [attr.aria-disabled]="disabled || loading"
      [attr.aria-busy]="loading"
      (click)="onClick($event)">
      
      <!-- Loading spinner -->
      <span *ngIf="loading" class="animate-spin mr-2" aria-hidden="true">
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>

      <!-- Prefix Icon -->
      <app-icon *ngIf="icon && !loading" [name]="icon" size="sm" class="mr-2" aria-hidden="true"></app-icon>

      <!-- Content slot -->
      <span class="inline-block"><ng-content></ng-content></span>

      <!-- Suffix Icon -->
      <app-icon *ngIf="suffixIcon && !loading" [name]="suffixIcon" size="sm" class="ml-2" aria-hidden="true"></app-icon>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) loading = false;
  @Input() icon?: string;
  @Input() suffixIcon?: string;
  @Input({ transform: booleanAttribute }) fullWidth = false;
  @Input() className = '';

  @Output() btnClick = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    const base = 'inline-flex items-center justify-center font-medium min-h-touch rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-[0.98] select-none';
    
    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-lg min-h-[38px]',
      md: 'px-5 py-2.5 text-sm min-h-[44px]',
      lg: 'px-6 py-3.5 text-base font-semibold rounded-2xl min-h-[50px]'
    }[this.size];

    const variants = {
      primary: 'bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500 shadow-brand-600/20 active:bg-brand-800',
      secondary: 'bg-brand-50 hover:bg-brand-100 text-brand-800 focus:ring-brand-400 active:bg-brand-200',
      gold: 'bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-slate-950 font-semibold shadow-gold-500/25 focus:ring-gold-400 active:opacity-90',
      outline: 'border border-slate-300 hover:border-brand-600 hover:text-brand-700 bg-white text-slate-700 focus:ring-brand-500 active:bg-slate-50',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 shadow-none focus:ring-slate-400 active:bg-slate-200',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 active:bg-red-800'
    }[this.variant];

    const width = this.fullWidth ? 'w-full' : '';

    return `${base} ${sizes} ${variants} ${width} ${this.className}`.trim();
  }

  public onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.btnClick.emit(event);
    }
  }
}
