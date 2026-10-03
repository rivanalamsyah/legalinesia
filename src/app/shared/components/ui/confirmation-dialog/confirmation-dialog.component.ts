import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

export type ConfirmationVariant = 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity" (click)="onCancel()"></div>

        <!-- Modal Box -->
        <div
          class="relative w-full max-w-md bg-navy-900 border border-navy-700 rounded-3xl p-6 shadow-2xl space-y-5 z-10 animate-scale-up"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          
          <div class="flex items-start gap-4">
            <div [class]="iconContainerClasses">
              <app-icon [name]="iconName" size="md"></app-icon>
            </div>
            
            <div class="space-y-1">
              <h3 id="confirm-dialog-title" class="text-lg font-bold text-white font-heading">
                {{ title }}
              </h3>
              <p class="text-xs text-white/70 leading-relaxed">
                {{ message }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-navy-800">
            <app-button variant="outline" size="sm" (click)="onCancel()">
              {{ cancelText }}
            </app-button>
            <app-button [variant]="confirmButtonVariant" size="sm" [loading]="loading" (click)="onConfirm()">
              {{ confirmText }}
            </app-button>
          </div>

        </div>
      </div>
    }
  `
})
export class ConfirmationDialogComponent {
  @Input() isOpen = false;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) message!: string;
  @Input() confirmText = 'Konfirmasi';
  @Input() cancelText = 'Batal';
  @Input() variant: ConfirmationVariant = 'danger';
  @Input() loading = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  public get confirmButtonVariant(): 'primary' | 'gold' | 'outline' {
    switch (this.variant) {
      case 'warning':
        return 'gold';
      case 'danger':
      case 'info':
      default:
        return 'primary';
    }
  }

  public get iconName(): string {
    switch (this.variant) {
      case 'danger':
        return 'alert-triangle';
      case 'warning':
        return 'alert-circle';
      case 'info':
      default:
        return 'info';
    }
  }

  public get iconContainerClasses(): string {
    const base = 'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0';
    switch (this.variant) {
      case 'danger':
        return `${base} bg-rose-500/10 border border-rose-500/20 text-rose-400`;
      case 'warning':
        return `${base} bg-amber-500/10 border border-amber-500/20 text-amber-400`;
      case 'info':
      default:
        return `${base} bg-brand-500/10 border border-brand-500/20 text-brand-400`;
    }
  }

  public onConfirm(): void {
    this.confirm.emit();
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  @HostListener('document:keydown.escape')
  public onEsc(): void {
    if (this.isOpen) {
      this.onCancel();
    }
  }
}
