import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export type KpiIconVariant = 'primary' | 'success' | 'warning' | 'purple' | 'gold' | 'danger' | 'neutral';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="glass-panel p-5 rounded-2xl border border-navy-800/80 hover:border-navy-700 transition-all shadow-sm flex items-center justify-between gap-4">
      <div class="space-y-1.5 flex-1 min-w-0">
        <span class="text-xs text-white/50 font-medium tracking-wide uppercase block truncate">
          {{ label }}
        </span>

        @if (loading) {
          <div class="h-7 w-24 bg-white/10 rounded-lg animate-pulse my-1"></div>
          <div class="h-3.5 w-32 bg-white/5 rounded-md animate-pulse"></div>
        } @else {
          <div class="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight leading-none">
            {{ value }}
          </div>

          @if (changeText) {
            <div class="flex items-center gap-1 text-xs font-medium pt-1">
              @if (trend === 'up') {
                <app-icon name="trending-up" size="xs" className="text-emerald-400"></app-icon>
                <span class="text-emerald-400">{{ changeText }}</span>
              } @else if (trend === 'down') {
                <app-icon name="trending-down" size="xs" className="text-rose-400"></app-icon>
                <span class="text-rose-400">{{ changeText }}</span>
              } @else {
                <span class="text-white/40">{{ changeText }}</span>
              }
            </div>
          }
        }
      </div>

      @if (iconName) {
        <div [class]="iconWrapperClasses">
          <app-icon [name]="iconName" size="md"></app-icon>
        </div>
      }
    </div>
  `
})
export class KpiCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string | number;
  @Input() changeText?: string;
  @Input() trend: 'up' | 'down' | 'neutral' = 'neutral';
  @Input() iconName?: string;
  @Input() iconVariant: KpiIconVariant = 'primary';
  @Input() loading = false;

  public get iconWrapperClasses(): string {
    const base = 'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200';
    const variants: Record<KpiIconVariant, string> = {
      primary: 'bg-brand-500/10 border border-brand-500/20 text-brand-400',
      success: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400',
      warning: 'bg-amber-500/10 border border-amber-500/20 text-amber-400',
      purple: 'bg-purple-500/10 border border-purple-500/20 text-purple-400',
      gold: 'bg-amber-500/15 border border-amber-400/30 text-amber-300',
      danger: 'bg-rose-500/10 border border-rose-500/20 text-rose-400',
      neutral: 'bg-white/5 border border-white/10 text-white/60'
    };
    return `${base} ${variants[this.iconVariant]}`;
  }
}
