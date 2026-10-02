import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <nav class="flex items-center justify-between border-t border-slate-200 px-4 py-4 sm:px-0" aria-label="Pagination">
      <!-- Previous Button -->
      <div class="-mt-px flex w-0 flex-1">
        <button
          type="button"
          [disabled]="currentPage <= 1"
          class="inline-flex items-center gap-2 border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
          (click)="selectPage(currentPage - 1)">
          <app-icon name="arrow-left" size="xs"></app-icon>
          Sebelumnya
        </button>
      </div>

      <!-- Page Numbers -->
      <div class="hidden md:-mt-px md:flex">
        <button
          *ngFor="let page of pages"
          type="button"
          [class]="getPageClasses(page)"
          [attr.aria-current]="page === currentPage ? 'page' : null"
          (click)="selectPage(page)">
          {{ page }}
        </button>
      </div>

      <!-- Next Button -->
      <div class="-mt-px flex w-0 flex-1 justify-end">
        <button
          type="button"
          [disabled]="currentPage >= totalPages"
          class="inline-flex items-center gap-2 border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
          (click)="selectPage(currentPage + 1)">
          Berikutnya
          <app-icon name="arrow-right" size="xs"></app-icon>
        </button>
      </div>
    </nav>
  `
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  public getPageClasses(page: number): string {
    const base = 'inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500';
    return page === this.currentPage
      ? `${base} border-brand-600 text-brand-600 font-bold`
      : `${base} border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700`;
  }

  public selectPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
