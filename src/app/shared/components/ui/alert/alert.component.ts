import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div
      *ngIf="visible"
      [class]="alertClasses"
      role="alert">
      
      <div class="flex items-start gap-3">
        <app-icon [name]="iconName" size="md" class="mt-0.5 flex-shrink-0"></app-icon>

        <div class="flex-1 text-sm">
          <h4 *ngIf="title" class="font-semibold mb-1">{{ title }}</h4>
          <div class="leading-relaxed">
            <ng-content></ng-content>
          </div>
        </div>

        <button
          *ngIf="dismissible"
          type="button"
          class="p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
          (click)="dismiss()"
          aria-label="Tutup notifikasi">
          <app-icon name="x" size="xs"></app-icon>
        </button>
      </div>
    </div>
  `
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() title?: string;
  @Input() dismissible = false;
  @Input() visible = true;

  @Output() dismissEvent = new EventEmitter<void>();

  get iconName(): string {
    switch (this.type) {
      case 'success': return 'check-circle-2';
      case 'warning': return 'alert-triangle';
      case 'error': return 'alert-circle';
      default: return 'info';
    }
  }

  get alertClasses(): string {
    const base = 'p-4 rounded-xl border text-sm transition-all duration-200';
    const types = {
      info: 'bg-blue-50 border-blue-200 text-blue-900',
      success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      warning: 'bg-amber-50 border-amber-200 text-amber-900',
      error: 'bg-red-50 border-red-200 text-red-900'
    }[this.type];

    return `${base} ${types}`;
  }

  public dismiss(): void {
    this.visible = false;
    this.dismissEvent.emit();
  }
}
