import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border-b border-slate-200">
      <nav class="-mb-px flex space-x-6 overflow-x-auto no-scrollbar" role="tablist" aria-label="Tabs">
        <button
          *ngFor="let tab of tabs"
          type="button"
          role="tab"
          [attr.aria-selected]="activeTab === tab.id"
          [attr.aria-controls]="'tabpanel-' + tab.id"
          [disabled]="tab.disabled"
          [class]="getTabClasses(tab)"
          (click)="selectTab(tab.id)">
          <span>{{ tab.label }}</span>
          <span
            *ngIf="tab.count !== undefined"
            [class]="getCountClasses(tab)">
            {{ tab.count }}
          </span>
        </button>
      </nav>
    </div>
  `
})
export class TabsComponent {
  @Input() tabs: TabItem[] = [];
  @Input() activeTab = '';
  @Output() tabChange = new EventEmitter<string>();

  public getTabClasses(tab: TabItem): string {
    const base = 'whitespace-nowrap py-3.5 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-t-sm';
    const isActive = this.activeTab === tab.id;
    
    if (tab.disabled) {
      return `${base} border-transparent text-slate-300 cursor-not-allowed`;
    }

    return isActive
      ? `${base} border-brand-600 text-brand-600 font-semibold`
      : `${base} border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300`;
  }

  public getCountClasses(tab: TabItem): string {
    const isActive = this.activeTab === tab.id;
    return isActive
      ? 'bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full text-xs font-bold'
      : 'bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs';
  }

  public selectTab(id: string): void {
    if (this.activeTab !== id) {
      this.tabChange.emit(id);
    }
  }
}
