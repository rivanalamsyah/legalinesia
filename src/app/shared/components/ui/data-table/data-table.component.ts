import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

export interface DataTableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  render?: (row: T) => string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, IconComponent, EmptyStateComponent],
  template: `
    <div class="glass-panel rounded-2xl border border-navy-800 overflow-hidden shadow-sm">
      
      <!-- Table Wrapper -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          
          <!-- Header -->
          <thead class="bg-white/5 border-b border-navy-800 text-white/60 uppercase tracking-wider font-semibold">
            <tr>
              @for (col of columns; track col.key) {
                <th
                  [style.width]="col.width"
                  [ngClass]="{
                    'text-left': !col.align || col.align === 'left',
                    'text-center': col.align === 'center',
                    'text-right': col.align === 'right',
                    'cursor-pointer select-none hover:text-white': col.sortable
                  }"
                  (click)="col.sortable ? onSort(col.key) : null"
                  class="p-4">
                  <div class="flex items-center gap-1.5" [ngClass]="{ 'justify-center': col.align === 'center', 'justify-end': col.align === 'right' }">
                    <span>{{ col.label }}</span>
                    @if (col.sortable) {
                      <app-icon name="arrow-up-down" size="xs" className="text-white/40"></app-icon>
                    }
                  </div>
                </th>
              }
            </tr>
          </thead>

          <!-- Body -->
          <tbody class="divide-y divide-navy-800/60 text-white/90">
            @if (loading) {
              @for (i of [1, 2, 3, 4]; track i) {
                <tr>
                  @for (col of columns; track col.key) {
                    <td class="p-4">
                      <div class="h-4 bg-white/5 rounded animate-pulse w-3/4"></div>
                    </td>
                  }
                </tr>
              }
            } @else if (data && data.length > 0) {
              @for (row of data; track trackByFn(row)) {
                <tr class="hover:bg-white/[0.02] transition-colors">
                  @for (col of columns; track col.key) {
                    <td
                      [ngClass]="{
                        'text-left': !col.align || col.align === 'left',
                        'text-center': col.align === 'center',
                        'text-right': col.align === 'right'
                      }"
                      class="p-4">
                      @if (col.render) {
                        <span [innerHTML]="col.render(row)"></span>
                      } @else {
                        <span>{{ getCellValue(row, col.key) }}</span>
                      }
                    </td>
                  }
                </tr>
              }
            }
          </tbody>

        </table>
      </div>

      <!-- Empty State -->
      @if (!loading && (!data || data.length === 0)) {
        <div class="p-8">
          <app-empty-state
            [title]="emptyTitle"
            [description]="emptyDescription"
            iconName="inbox">
          </app-empty-state>
        </div>
      }

    </div>
  `
})
export class DataTableComponent<T = any> {
  @Input({ required: true }) columns: DataTableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() loading = false;
  @Input() emptyTitle = 'Tidak ada data';
  @Input() emptyDescription = 'Belum ada data yang tersedia untuk ditampilkan.';
  @Input() trackByKey = 'id';

  @Output() sort = new EventEmitter<{ key: string; direction: 'asc' | 'desc' }>();

  public currentSortKey?: string;
  public sortDirection: 'asc' | 'desc' = 'asc';

  public trackByFn(row: any): any {
    return row ? row[this.trackByKey] || row : row;
  }

  public getCellValue(row: any, key: string): any {
    return row ? row[key] : '';
  }

  public onSort(key: string): void {
    if (this.currentSortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortKey = key;
      this.sortDirection = 'asc';
    }
    this.sort.emit({ key, direction: this.sortDirection });
  }
}
