import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="flex items-center gap-1" [attr.aria-label]="'Rating ' + currentRating + ' dari ' + maxStars + ' bintang'">
      <app-icon
        *ngFor="let star of starState; let i = index"
        name="star"
        [size]="size"
        [className]="star === 'full' ? 'text-amber-400 fill-amber-400' : star === 'half' ? 'text-amber-300 fill-amber-200' : 'text-slate-200'">
      </app-icon>
      <span *ngIf="showCount && reviewCount !== undefined" class="ml-1 text-xs text-slate-500 font-medium">({{ reviewCount }})</span>
      <span *ngIf="showValue" class="ml-1 text-xs font-semibold text-slate-700">{{ currentRating.toFixed(1) }}</span>
    </div>
  `
})
export class RatingComponent {
  @Input() value?: number;
  @Input() rating?: number;
  @Input() maxStars = 5;
  @Input() showCount = false;
  @Input() showValue = false;
  @Input() reviewCount?: number;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'sm';

  get currentRating(): number {
    return this.rating ?? this.value ?? 0;
  }

  get starState(): ('full' | 'half' | 'empty')[] {
    const val = this.currentRating;
    return Array.from({ length: this.maxStars }, (_, i) => {
      if (i + 1 <= Math.floor(val)) return 'full';
      if (i < val && val % 1 >= 0.5) return 'half';
      return 'empty';
    });
  }
}
