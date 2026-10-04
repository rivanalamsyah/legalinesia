import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LUCIDE_ICONS, LucideIconProviderInterface } from 'lucide-angular';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <span [class]="containerClasses()" [attr.aria-hidden]="true">
      <lucide-icon 
        [name]="safeIconName()" 
        [strokeWidth]="strokeWidth"
        class="w-full h-full text-current transition-colors">
      </lucide-icon>
    </span>
  `
})
export class IconComponent {
  @Input({ required: true }) name!: string;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() strokeWidth = 1.8;
  @Input() className = '';

  private readonly iconProviders = inject<LucideIconProviderInterface[]>(LUCIDE_ICONS, { optional: true });

  public normalizedName = computed(() => {
    if (!this.name) return 'circle-help';
    const n = this.name.trim().toLowerCase();
    
    // Alias mapping for common legacy & renamed Lucide icon names
    const aliases: Record<string, string> = {
      'x-circle': 'circle-x',
      'check-circle': 'circle-check',
      'check-circle-2': 'circle-check',
      'alert-circle': 'circle-alert',
      'alert-triangle': 'triangle-alert',
      'help-circle': 'circle-help',
      'plus-circle': 'circle-plus',
      'minus-circle': 'circle-minus',
      'user-circle': 'circle-user',
      'play-circle': 'circle-play',
      'pause-circle': 'circle-pause',
      'stop-circle': 'circle-stop',
      'arrow-up-circle': 'circle-arrow-up',
      'arrow-down-circle': 'circle-arrow-down',
      'arrow-left-circle': 'circle-arrow-left',
      'arrow-right-circle': 'circle-arrow-right',
      'calendar-x': 'calendar-x-2',
      'file-check': 'file-check-2',
      'trash': 'trash-2',
      'close': 'x',
      'logout': 'log-out',
      'dashboard': 'layout-dashboard',
      'help': 'circle-help'
    };
    
    return aliases[n] || n;
  });

  /**
   * Ensure icon name exists in provider; fallback to circle-help if unknown to prevent runtime errors.
   */
  public safeIconName = computed(() => {
    const nameToTest = this.normalizedName();
    if (!this.iconProviders || this.iconProviders.length === 0) return nameToTest;
    
    // Check if any provider has this icon
    const exists = this.iconProviders.some(p => p.hasIcon && p.hasIcon(nameToTest));
    return exists ? nameToTest : 'circle-help';
  });

  public containerClasses = computed(() => {
    const sizeClasses = {
      xs: 'w-3.5 h-3.5',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8'
    }[this.size] || 'w-5 h-5';

    return `inline-flex items-center justify-center shrink-0 ${sizeClasses} ${this.className}`;
  });
}
