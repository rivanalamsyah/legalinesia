import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'mb-12 ' + (centered ? 'text-center' : '')">
      @if (resolvedBadge) {
        <p class="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-[0.15em] border border-brand-100 mb-4">
          {{ resolvedBadge }}
        </p>
      }
      <h2 class="font-heading text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
        {{ title }}
        @if (titleAccent) {
          <span class="text-gradient-primary"> {{ titleAccent }}</span>
        }
      </h2>
      @if (resolvedSubtitle) {
        <p class="mt-4 text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl" [class.mx-auto]="centered">
          {{ resolvedSubtitle }}
        </p>
      }
    </div>
  `
})
export class SectionHeaderComponent {
  /** Primary text label displayed above the heading (legacy: eyebrow) */
  @Input() eyebrow?: string;
  /** Badge label displayed as a pill chip above heading (alias for eyebrow) */
  @Input() badge?: string;

  @Input({ required: true }) title!: string;
  @Input() titleAccent?: string;

  /** Body description text below heading (legacy: description) */
  @Input() description?: string;
  /** Subtitle displayed below heading (alias for description) */
  @Input() subtitle?: string;

  @Input() centered = true;

  get resolvedBadge(): string | undefined {
    return this.badge ?? this.eyebrow;
  }

  get resolvedSubtitle(): string | undefined {
    return this.subtitle ?? this.description;
  }
}
