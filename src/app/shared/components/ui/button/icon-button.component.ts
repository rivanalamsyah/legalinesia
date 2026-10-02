import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { ButtonVariant, ButtonSize } from './button.component';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      [attr.aria-label]="ariaLabel"
      [attr.title]="ariaLabel || title"
      (click)="onClick($event)">
      
      <span *ngIf="loading" class="animate-spin" aria-hidden="true">
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>

      <app-icon *ngIf="!loading" [name]="icon" [size]="iconSize" aria-hidden="true"></app-icon>
    </button>
  `
})
export class IconButtonComponent {
  @Input() icon!: string;
  @Input() ariaLabel!: string;
  @Input() title?: string;
  @Input() variant: ButtonVariant = 'ghost';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() className = '';

  @Output() btnClick = new EventEmitter<MouseEvent>();

  get iconSize(): 'sm' | 'md' | 'lg' {
    return this.size === 'sm' ? 'sm' : this.size === 'lg' ? 'lg' : 'md';
  }

  get buttonClasses(): string {
    const base = 'inline-flex items-center justify-center rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95 select-none';
    
    const sizes = {
      sm: 'w-8 h-8 min-w-[32px] min-h-[32px] rounded-lg',
      md: 'w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl',
      lg: 'w-13 h-13 min-w-[52px] min-h-[52px] rounded-2xl'
    }[this.size];

    const variants = {
      primary: 'bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500',
      secondary: 'bg-brand-50 hover:bg-brand-100 text-brand-800 focus:ring-brand-400',
      gold: 'bg-gold-500 hover:bg-gold-600 text-slate-950 focus:ring-gold-400',
      outline: 'border border-slate-300 hover:border-brand-600 hover:text-brand-700 bg-white text-slate-700 focus:ring-brand-500',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-400',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
    }[this.variant];

    return `${base} ${sizes} ${variants} ${this.className}`.trim();
  }

  public onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.btnClick.emit(event);
    }
  }
}
