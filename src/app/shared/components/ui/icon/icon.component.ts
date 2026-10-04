import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <span [class]="containerClasses()" [attr.aria-hidden]="true">
      <lucide-icon 
        [name]="normalizedName()" 
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

  public normalizedName = computed(() => {
    if (!this.name) return 'help-circle';
    const n = this.name.trim().toLowerCase();
    
    // Alias mapping for common icon names across the project
    const aliases: Record<string, string> = {
      'check-circle': 'check-circle-2',
      'trash': 'trash-2',
      'close': 'x',
      'logout': 'log-out',
      'dashboard': 'layout-dashboard',
      'panel-left-open': 'panel-left-open',
      'panel-left-close': 'panel-left-close',
      'help': 'help-circle'
    };
    
    return aliases[n] || n;
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
