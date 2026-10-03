import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="glass-panel p-4 rounded-2xl border border-navy-800 space-y-3">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        <!-- Search Input -->
        <div class="relative flex-1 max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
            <app-icon name="search" size="sm"></app-icon>
          </div>
          <input
            type="text"
            [placeholder]="searchPlaceholder"
            [value]="searchTerm"
            (input)="onSearchInput($event)"
            class="w-full pl-9 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400" />
          @if (searchTerm) {
            <button
              type="button"
              (click)="clearSearch()"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white">
              <app-icon name="x" size="xs"></app-icon>
            </button>
          }
        </div>

        <!-- Dynamic Dropdown Filters -->
        @if (filterGroups && filterGroups.length > 0) {
          <div class="flex flex-wrap items-center gap-2">
            @for (group of filterGroups; track group.key) {
              <div class="relative">
                <select
                  [value]="activeFilters[group.key] || ''"
                  (change)="onFilterSelect(group.key, $event)"
                  class="appearance-none px-3 py-2 pr-8 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-400 cursor-pointer">
                  <option value="" class="bg-navy-900 text-white">{{ group.label }}: Semua</option>
                  @for (opt of group.options; track opt.value) {
                    <option [value]="opt.value" class="bg-navy-900 text-white">{{ opt.label }}</option>
                  }
                </select>
                <div class="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-white/40">
                  <app-icon name="chevron-down" size="xs"></app-icon>
                </div>
              </div>
            }

            @if (hasActiveFilters()) {
              <button
                type="button"
                (click)="resetAll()"
                class="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-colors flex items-center gap-1">
                <app-icon name="rotate-ccw" size="xs"></app-icon>
                <span>Reset</span>
              </button>
            }
          </div>
        }

      </div>
    </div>
  `
})
export class FilterBarComponent {
  @Input() searchPlaceholder = 'Cari kata kunci...';
  @Input() filterGroups: FilterGroup[] = [];

  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<Record<string, string>>();
  @Output() reset = new EventEmitter<void>();

  public searchTerm = '';
  public activeFilters: Record<string, string> = {};

  public onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchTerm = val;
    this.searchChange.emit(val);
  }

  public clearSearch(): void {
    this.searchTerm = '';
    this.searchChange.emit('');
  }

  public onFilterSelect(key: string, event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    if (val) {
      this.activeFilters[key] = val;
    } else {
      delete this.activeFilters[key];
    }
    this.filterChange.emit({ ...this.activeFilters });
  }

  public hasActiveFilters(): boolean {
    return Boolean(this.searchTerm) || Object.keys(this.activeFilters).length > 0;
  }

  public resetAll(): void {
    this.searchTerm = '';
    this.activeFilters = {};
    this.searchChange.emit('');
    this.filterChange.emit({});
    this.reset.emit();
  }
}
