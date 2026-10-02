import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-divider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="orientation === 'horizontal'" class="relative my-6">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-slate-200"></div>
      </div>
      <div *ngIf="label" class="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
        <span class="bg-white px-3 text-slate-400">{{ label }}</span>
      </div>
    </div>

    <div
      *ngIf="orientation === 'vertical'"
      class="inline-block h-full min-h-[1em] w-px self-stretch bg-slate-200 opacity-100 mx-3"></div>
  `
})
export class DividerComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() label?: string;
}
