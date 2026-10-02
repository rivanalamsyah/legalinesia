import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconButtonComponent } from '../button/icon-button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, IconButtonComponent],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" [attr.aria-labelledby]="title ? id + '-title' : null">
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        (click)="onBackdropClick()"
        aria-hidden="true"></div>

      <!-- Container -->
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          [class]="modalClasses"
          (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div *ngIf="title || showCloseButton" class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 *ngIf="title" [id]="id + '-title'" class="font-heading text-lg font-semibold text-slate-900">
              {{ title }}
            </h3>
            <app-icon-button
              *ngIf="showCloseButton"
              icon="x"
              ariaLabel="Tutup dialog"
              variant="ghost"
              size="sm"
              (btnClick)="close()">
            </app-icon-button>
          </div>

          <!-- Body -->
          <div class="p-6">
            <ng-content></ng-content>
          </div>

          <!-- Footer slot -->
          <div *ngIf="hasFooter" class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-2xl">
            <ng-content select="[modal-footer]"></ng-content>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() id = 'modal-' + Math.random().toString(36).substring(2, 9);
  @Input() isOpen = false;
  @Input() title?: string;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() closeOnBackdrop = true;
  @Input() showCloseButton = true;
  @Input() hasFooter = false;

  @Output() closeEvent = new EventEmitter<void>();

  get modalClasses(): string {
    const base = 'relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all my-8 w-full z-10';
    const sizes = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl'
    }[this.size];

    return `${base} ${sizes}`;
  }

  @HostListener('document:keydown.escape')
  public onEscape(): void {
    if (this.isOpen) {
      this.close();
    }
  }

  public onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.close();
    }
  }

  public close(): void {
    this.closeEvent.emit();
  }
}
