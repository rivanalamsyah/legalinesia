import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  template: `
    <div class="text-center py-12 px-4 max-w-md mx-auto">
      <div class="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4 shadow-inner">
        <app-icon [name]="icon" size="xl"></app-icon>
      </div>

      <h3 class="font-heading font-semibold text-lg text-slate-900 mb-2">
        {{ title }}
      </h3>
      
      <p class="text-slate-500 text-sm leading-relaxed mb-6">
        {{ description }}
      </p>

      <app-button
        *ngIf="actionLabel"
        variant="primary"
        size="md"
        [icon]="actionIcon"
        (btnClick)="onAction()">
        {{ actionLabel }}
      </app-button>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() icon = 'search-x';
  @Input() title = 'Tidak ada data ditemukan';
  @Input() description = 'Coba sesuaikan kata kunci pencarian atau filter Anda.';
  @Input() actionLabel?: string;
  @Input() actionIcon?: string;

  @Output() actionClick = new EventEmitter<void>();

  public onAction(): void {
    this.actionClick.emit();
  }
}
