import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block">
      <!-- Image Avatar -->
      <img
        *ngIf="src && !hasError"
        [src]="src"
        [alt]="alt"
        [class]="avatarClasses"
        (error)="hasError = true" />

      <!-- Fallback Initials -->
      <div
        *ngIf="!src || hasError"
        [class]="avatarClasses"
        class="bg-gradient-to-br from-brand-600 to-navy-800 text-white font-bold flex items-center justify-center">
        {{ initials }}
      </div>

      <!-- Online Status Badge -->
      <span
        *ngIf="online"
        class="absolute bottom-0 right-0 block w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
    </div>
  `
})
export class AvatarComponent {
  @Input() src?: string;
  @Input() name = '';
  @Input() alt = 'Avatar user';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() online?: boolean;
  @Input() className = '';

  public hasError = false;

  get initials(): string {
    if (!this.name) return 'U';
    const parts = this.name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  get avatarClasses(): string {
    const base = 'rounded-full object-cover shadow-sm ring-2 ring-white select-none';
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-11 h-11 text-sm',
      lg: 'w-16 h-16 text-lg',
      xl: 'w-24 h-24 text-2xl'
    }[this.size];

    return `${base} ${sizes} ${this.className}`.trim();
  }
}
