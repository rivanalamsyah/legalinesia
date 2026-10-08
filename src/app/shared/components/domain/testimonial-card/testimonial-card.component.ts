import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from '../../ui/rating/rating.component';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { ReviewItem } from '../../../../core/services/mock-data.service';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  imports: [CommonModule, RatingComponent, AvatarComponent, IconComponent],
  template: `
    <blockquote class="surface-card p-6 flex flex-col justify-between h-full relative">
      <!-- Quote decorative Icon -->
      <div class="text-slate-200/80 absolute top-4 right-4 pointer-events-none select-none" aria-hidden="true">
        <app-icon name="quote" size="xl" className="w-10 h-10 text-slate-200"></app-icon>
      </div>

      <div class="relative z-10">
        <div class="mb-3">
          <app-rating [value]="review.rating" size="sm"></app-rating>
        </div>

        <p class="text-slate-700 text-sm md:text-base leading-relaxed mb-6 italic">
          "{{ review.comment }}"
        </p>
      </div>

      <div class="flex items-center gap-3 pt-4 border-t border-slate-100 relative z-10">
        <app-avatar [name]="review.clientName" size="md"></app-avatar>
        <div>
          <cite class="font-heading font-bold text-slate-900 text-sm not-italic block">
            {{ review.clientName }}
          </cite>
          <span *ngIf="review.caseCategory" class="text-xs text-brand-600 font-medium">
            Kasus {{ review.caseCategory }}
          </span>
        </div>
      </div>
    </blockquote>
  `
})
export class TestimonialCardComponent {
  @Input() review!: ReviewItem;
}
