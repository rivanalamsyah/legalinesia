import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../core/services/notification.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div
      aria-live="polite"
      aria-atomic="false"
      class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      
      @for (toast of toasts(); track toast.id) {
        <div
          class="pointer-events-auto w-full flex items-start gap-3 p-4 rounded-2xl shadow-2xl border transition-all duration-300 animate-in slide-in-from-top-2"
          [ngClass]="toastClasses(toast.type)"
          role="alert">
          
          <app-icon [name]="iconFor(toast.type)" size="md" class="shrink-0 mt-0.5"></app-icon>
          
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold">{{ toast.title }}</p>
            <p class="text-xs mt-0.5 opacity-80">{{ toast.message }}</p>
          </div>

          <button
            type="button"
            class="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            (click)="dismiss(toast.id)"
            [attr.aria-label]="'Tutup notifikasi ' + toast.title">
            <app-icon name="x" size="sm"></app-icon>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  private readonly notificationService = inject(NotificationService);
  public readonly toasts = this.notificationService.toasts;

  public toastClasses(type: string): Record<string, boolean> {
    return {
      'bg-white border-emerald-200 text-emerald-800': type === 'success',
      'bg-white border-red-200 text-red-800': type === 'error',
      'bg-white border-amber-200 text-amber-800': type === 'warning',
      'bg-white border-brand-200 text-brand-800': type === 'info',
    };
  }

  public iconFor(type: string): string {
    const map: Record<string, string> = {
      success: 'check',
      error: 'x',
      warning: 'chevron-down',
      info: 'shield-check'
    };
    return map[type] ?? 'shield-check';
  }

  public dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}
