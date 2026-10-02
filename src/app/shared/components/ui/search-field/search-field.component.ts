import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-search-field',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  template: `
    <form (ngSubmit)="onSubmit()" class="w-full relative flex items-center">
      <div class="absolute left-4 text-slate-400 pointer-events-none flex items-center">
        <app-icon name="search" size="md"></app-icon>
      </div>

      <input
        type="text"
        [value]="value"
        [placeholder]="placeholder"
        [disabled]="disabled"
        aria-label="Cari kata kunci"
        class="w-full pl-12 pr-28 py-3.5 text-sm md:text-base text-slate-900 bg-white border border-slate-300 rounded-2xl shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-100"
        (input)="onInputChange($event)" />

      <div class="absolute right-2 flex items-center gap-1">
        <button
          *ngIf="value"
          type="button"
          class="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          (click)="clear()"
          aria-label="Hapus kata kunci">
          <app-icon name="x" size="xs"></app-icon>
        </button>

        <app-button
          type="submit"
          variant="primary"
          size="sm"
          [disabled]="disabled">
          Cari
        </app-button>
      </div>
    </form>
  `
})
export class SearchFieldComponent {
  @Input() value = '';
  @Input() placeholder = 'Cari advokat, layanan hukum, atau topik...';
  @Input() disabled = false;

  @Output() search = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();

  public onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.valueChange.emit(val);
  }

  public onSubmit(): void {
    this.search.emit(this.value);
  }

  public clear(): void {
    this.value = '';
    this.valueChange.emit('');
    this.search.emit('');
  }
}
