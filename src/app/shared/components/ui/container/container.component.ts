import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class ContainerComponent {
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'lg';
  @Input() className = '';

  get containerClasses(): string {
    const base = 'w-full mx-auto px-4 sm:px-6 lg:px-8';
    const sizes = {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      xl: 'max-w-8xl',
      full: 'max-w-none'
    }[this.size];

    return `${base} ${sizes} ${this.className}`.trim();
  }
}
