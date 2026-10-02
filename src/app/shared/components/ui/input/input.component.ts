import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="w-full">
      <!-- Label -->
      <label *ngIf="label" [for]="id" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
        {{ label }}
        <span *ngIf="required" class="text-red-500" title="Wajib diisi">*</span>
      </label>

      <!-- Input Group -->
      <div class="relative flex items-center">
        <!-- Prefix Icon -->
        <div *ngIf="icon" class="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
          <app-icon [name]="icon" size="sm"></app-icon>
        </div>

        <input
          [id]="id"
          [type]="type"
          [value]="value"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [attr.aria-invalid]="!!errorMessage"
          [attr.aria-describedby]="errorMessage ? id + '-error' : helperText ? id + '-helper' : null"
          [class]="inputClasses"
          (input)="onInput($event)"
          (blur)="onBlur()" />

        <!-- Clearable Button -->
        <button
          *ngIf="clearable && value"
          type="button"
          class="absolute right-3 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
          (click)="clear()"
          aria-label="Hapus teks">
          <app-icon name="x" size="xs"></app-icon>
        </button>
      </div>

      <!-- Helper Text -->
      <p *ngIf="helperText && !errorMessage" [id]="id + '-helper'" class="mt-1.5 text-xs text-slate-500">
        {{ helperText }}
      </p>

      <!-- Error Message -->
      <p *ngIf="errorMessage" [id]="id + '-error'" class="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1" role="alert">
        <app-icon name="alert-circle" size="xs"></app-icon>
        {{ errorMessage }}
      </p>
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = 'input-' + Math.random().toString(36).substring(2, 9);
  @Input() label?: string;
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text';
  @Input() placeholder = '';
  @Input() helperText?: string;
  @Input() errorMessage?: string;
  @Input() icon?: string;
  @Input() required = false;
  @Input() disabled = false;
  @Input() clearable = false;

  public value = '';
  public onChange: (val: string) => void = () => {};
  public onTouched: () => void = () => {};

  get inputClasses(): string {
    const base = 'w-full px-4 py-2.5 min-h-touch text-sm text-slate-900 bg-white border rounded-xl transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed';
    const paddingLeft = this.icon ? 'pl-10' : '';
    const paddingRight = this.clearable ? 'pr-10' : '';
    const borderState = this.errorMessage
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : 'border-slate-300 hover:border-slate-400 focus:border-brand-600 focus:ring-brand-100';

    return `${base} ${paddingLeft} ${paddingRight} ${borderState}`.trim();
  }

  public writeValue(val: string): void {
    this.value = val || '';
  }

  public registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  public onBlur(): void {
    this.onTouched();
  }

  public clear(): void {
    this.value = '';
    this.onChange('');
  }
}
