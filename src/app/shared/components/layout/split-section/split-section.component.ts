import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../ui/container/container.component';
import { SectionHeaderComponent } from '../../ui/section-header/section-header.component';

@Component({
  selector: 'app-split-section',
  standalone: true,
  imports: [CommonModule, ContainerComponent, SectionHeaderComponent],
  template: `
    <section [class]="'section-padding ' + (bg === 'slate' ? 'bg-slate-50' : 'bg-white')">
      <app-container size="lg">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div [class]="reverseOnDesktop ? 'lg:col-span-6 lg:order-2' : 'lg:col-span-6 lg:order-1'">
            <app-section-header
              *ngIf="title"
              [title]="title"
              [subtitle]="subtitle"
              [badge]="badge">
            </app-section-header>
            <div class="mt-6">
              <ng-content select="[split-content]"></ng-content>
            </div>
          </div>

          <div [class]="reverseOnDesktop ? 'lg:col-span-6 lg:order-1' : 'lg:col-span-6 lg:order-2'">
            <ng-content select="[split-media]"></ng-content>
          </div>

        </div>
      </app-container>
    </section>
  `
})
export class SplitSectionComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() badge?: string;
  @Input() reverseOnDesktop = false;
  @Input() bg: 'white' | 'slate' = 'white';
}
