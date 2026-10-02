import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="w-full">
      <label *ngIf="label" [for]="id" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>

      <div class="relative flex items-center">
        <select
          [id]="id"
          [value]="value"
          [disabled]="disabled"
          [attr.aria-invalid]="!!errorMessage"
          [class]="selectClasses"
          (change)="onChangeSelect($event)"
          (blur)="onBlur()">
          <option *ngIf="placeholder" value="" disabled selected>{{ placeholder }}</option>
          <option *ngFor="let opt of options" [value]="opt.value" [disabled]="opt.disabled">
            {{ opt.label }}
          </option>
        </select>

        <div class="absolute right-3.5 pointer-events-none text-slate-500">
          <app-icon name="chevron-down" size="sm"></app-icon>
        </div>
      </div>

      <p *ngIf="helperText && !errorMessage" class="mt-1.5 text-xs text-slate-500">{{ helperText }}</p>
      <p *ngIf="errorMessage" class="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1" role="alert">
        <app-icon name="alert-circle" size="xs"></app-icon>
        {{ errorMessage }}
      </p>
    </div>
  `
})
export class SelectComponent implements ControlValueAccessor {
  @Input() id = 'select-' + Math.random().toString(36).substring(2, 9);
  @Input() label?: string;
  @Input() placeholder = 'Pilih opsi';
  @Input() options: SelectOption[] = [];
  @Input() helperText?: string;
  @Input() errorMessage?: string;
  @Input() required = false;
  @Input() disabled = false;

  public value: string | number = '';
  public onChange: (val: string | number) => void = () => {};
  public onTouched: () => void = () => {};

  get selectClasses(): string {
    const base = 'w-full px-4 py-2.5 pr-10 min-h-touch text-sm text-slate-900 bg-white border rounded-xl appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed';
    const borderState = this.errorMessage
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : 'border-slate-300 hover:border-slate-400 focus:border-brand-600 focus:ring-brand-100';

    return `${base} ${borderState}`.trim();
  }

  public writeValue(val: string | number): void {
    this.value = val !== undefined && val !== null ? val : '';
  }

  public registerOnChange(fn: (val: string | number) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onChangeSelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.value = val;
    this.onChange(val);
  }

  public onBlur(): void {
    this.onTouched();
  }
}
