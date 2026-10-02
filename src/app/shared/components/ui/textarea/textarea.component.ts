import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  template: `
    <div class="w-full">
      <div class="flex justify-between items-center mb-1.5">
        <label *ngIf="label" [for]="id" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {{ label }}
          <span *ngIf="required" class="text-red-500">*</span>
        </label>
        <span *ngIf="maxLength" class="text-xs text-slate-400">
          {{ value.length }}/{{ maxLength }}
        </span>
      </div>

      <textarea
        [id]="id"
        [value]="value"
        [rows]="rows"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [attr.maxlength]="maxLength || null"
        [attr.aria-invalid]="!!errorMessage"
        [class]="textareaClasses"
        (input)="onInput($event)"
        (blur)="onBlur()"></textarea>

      <p *ngIf="helperText && !errorMessage" class="mt-1.5 text-xs text-slate-500">{{ helperText }}</p>
      <p *ngIf="errorMessage" class="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1" role="alert">
        <app-icon name="alert-circle" size="xs"></app-icon>
        {{ errorMessage }}
      </p>
    </div>
  `
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() id = 'textarea-' + Math.random().toString(36).substring(2, 9);
  @Input() label?: string;
  @Input() rows = 4;
  @Input() placeholder = '';
  @Input() helperText?: string;
  @Input() errorMessage?: string;
  @Input() maxLength?: number;
  @Input() required = false;
  @Input() disabled = false;

  public value = '';
  public onChange: (val: string) => void = () => {};
  public onTouched: () => void = () => {};

  get textareaClasses(): string {
    const base = 'w-full px-4 py-3 text-sm text-slate-900 bg-white border rounded-xl transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed resize-y min-h-[100px]';
    const borderState = this.errorMessage
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : 'border-slate-300 hover:border-slate-400 focus:border-brand-600 focus:ring-brand-100';

    return `${base} ${borderState}`.trim();
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
    const val = (event.target as HTMLTextAreaElement).value;
    this.value = val;
    this.onChange(val);
  }

  public onBlur(): void {
    this.onTouched();
  }
}
