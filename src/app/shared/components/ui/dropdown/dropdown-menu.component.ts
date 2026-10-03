import { Component, Input, Output, EventEmitter, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export interface DropdownMenuItem {
  id: string;
  label: string;
  iconName?: string;
  badge?: string;
  danger?: boolean;
  divider?: boolean;
}

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="relative inline-block text-left">
      
      <!-- Trigger button slot -->
      <div (click)="toggleOpen()">
        <ng-content select="[trigger]"></ng-content>
      </div>

      <!-- Dropdown Popover Menu -->
      @if (isOpen) {
        <div
          class="absolute right-0 mt-2 w-56 rounded-2xl bg-navy-900 border border-navy-700 shadow-2xl py-1.5 z-50 transition-all transform opacity-100 scale-100"
          role="menu"
          aria-orientation="vertical">

          @if (headerTitle) {
            <div class="px-3.5 py-2 border-b border-navy-800 text-[11px] font-bold text-white/40 uppercase tracking-wider">
              {{ headerTitle }}
            </div>
          }

          @for (item of items; track item.id) {
            @if (item.divider) {
              <div class="my-1 border-t border-navy-800"></div>
            } @else {
              <button
                type="button"
                role="menuitem"
                (click)="onSelectItem(item)"
                class="w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between transition-colors hover:bg-white/5"
                [ngClass]="item.danger ? 'text-rose-400 hover:text-rose-300' : 'text-white/80 hover:text-white'">

                <div class="flex items-center gap-2.5">
                  @if (item.iconName) {
                    <app-icon [name]="item.iconName" size="xs"></app-icon>
                  }
                  <span>{{ item.label }}</span>
                </div>

                @if (item.badge) {
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-300">
                    {{ item.badge }}
                  </span>
                }
              </button>
            }
          }
        </div>
      }

    </div>
  `
})
export class DropdownMenuComponent {
  @Input() items: DropdownMenuItem[] = [];
  @Input() headerTitle?: string;
  @Output() selectItem = new EventEmitter<DropdownMenuItem>();

  public isOpen = false;
  private readonly elementRef = inject(ElementRef);

  public toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

  public onSelectItem(item: DropdownMenuItem): void {
    this.selectItem.emit(item);
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  public onKeydownEscape(): void {
    this.isOpen = false;
  }
}
