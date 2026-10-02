import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../../ui/badge/badge.component';

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  authorName: string;
  publishedAt: string;
  readTime: number;
}

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <article class="surface-card flex flex-col justify-between h-full group overflow-hidden">
      <div class="p-6">
        <div class="flex items-center gap-2 mb-3">
          <app-badge variant="brand" size="sm">{{ article.category }}</app-badge>
          <span class="text-xs text-slate-400">• {{ article.readTime }} min baca</span>
        </div>

        <h3 class="font-heading font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors mb-2 line-clamp-2">
          {{ article.title }}
        </h3>

        <p class="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {{ article.excerpt }}
        </p>
      </div>

      <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Oleh {{ article.authorName }}</span>
        <span>{{ article.publishedAt }}</span>
      </div>
    </article>
  `
})
export class ArticleCardComponent {
  @Input() article!: ArticleItem;
}
