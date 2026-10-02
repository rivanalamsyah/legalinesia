import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from '../../ui/rating/rating.component';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { ReviewItem } from '../../../../core/services/mock-data.service';

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  imports: [CommonModule, RatingComponent, AvatarComponent],
  template: `
    <blockquote class="surface-card p-6 flex flex-col justify-between h-full relative">
      <!-- Quote decorative SVG -->
      <div class="text-slate-100 absolute top-4 right-4 pointer-events-none select-none" aria-hidden="true">
        <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
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
