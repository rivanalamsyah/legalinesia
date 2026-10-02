import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SkeletonConfig {
  rows?: number;
  type?: 'text' | 'card' | 'avatar' | 'rect';
}

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div role="status" [attr.aria-label]="'Memuat ' + label" class="animate-pulse">
      @switch (type) {
        @case ('avatar') {
          <div class="rounded-full bg-slate-200 w-14 h-14"></div>
        }
        @case ('card') {
          <div class="rounded-2xl bg-slate-100 border border-slate-200 p-6 space-y-4">
            <div class="h-4 bg-slate-200 rounded w-3/4"></div>
            <div class="h-4 bg-slate-200 rounded w-1/2"></div>
            <div class="h-16 bg-slate-200 rounded"></div>
            <div class="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        }
        @case ('rect') {
          <div class="rounded-xl bg-slate-200" [style.height.px]="height"></div>
        }
        @default {
          @for (row of rowsArray; track $index) {
            <div class="mb-2 h-4 bg-slate-200 rounded" [style.width]="rowWidth($index)"></div>
          }
        }
      }
    </div>
  `
})
export class SkeletonComponent {
  @Input() type: 'text' | 'card' | 'avatar' | 'rect' = 'text';
  @Input() rows = 3;
  @Input() label = 'konten';
  @Input() height = 200;

  public get rowsArray(): number[] {
    return Array.from({ length: this.rows });
  }

  public rowWidth(index: number): string {
    const widths = ['100%', '85%', '70%', '90%', '60%'];
    return widths[index % widths.length];
  }
}
