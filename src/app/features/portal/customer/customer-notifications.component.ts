import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerNotificationService } from '../../../core/services/customer-notification.service';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-customer-notifications',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IconComponent,
    PortalPageHeaderComponent,
    ButtonComponent
  ],
  template: `
    <div class="space-y-6">
      
      <!-- Page Header -->
      <app-portal-page-header
        categoryLabel="Portal Klien"
        title="Notifikasi & Pemberitahuan Aktivitas"
        subtitle="Log pemberitahuan real-time mengenai status booking, pengingat sesi video, dan verifikasi pembayaran."
        [breadcrumbs]="[{ label: 'Portal Klien', url: '/portal/customer' }, { label: 'Notifikasi' }]">
        
        @if (notifService.unreadCount() > 0) {
          <app-button
            variant="outline"
            size="sm"
            iconLeft="check-check"
            (click)="notifService.markAllAsRead()">
            Tandai Semua Dibaca
          </app-button>
        }
      </app-portal-page-header>

      <!-- Filter Tabs -->
      <div class="flex items-center gap-2 border-b border-navy-800 pb-3">
        <button
          type="button"
          (click)="filterMode.set('ALL')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
          [ngClass]="filterMode() === 'ALL' ? 'bg-brand-500 text-white shadow-md' : 'bg-white/5 text-white/70 hover:bg-white/10'">
          Semua ({{ notifService.customerNotifications().length }})
        </button>
        <button
          type="button"
          (click)="filterMode.set('UNREAD')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
          [ngClass]="filterMode() === 'UNREAD' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'bg-white/5 text-white/70 hover:bg-white/10'">
          <span>Belum Dibaca</span>
          @if (notifService.unreadCount() > 0) {
            <span class="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">{{ notifService.unreadCount() }}</span>
          }
        </button>
      </div>

      <!-- Notifications List -->
      <div class="space-y-3">
        @if (displayNotifications().length > 0) {
          @for (item of displayNotifications(); track item.id) {
            <div
              (click)="onNotificationClick(item)"
              class="glass-panel p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 hover:border-navy-700"
              [ngClass]="item.isRead ? 'border-navy-800/60 opacity-80' : 'border-brand-500/40 bg-brand-500/5 shadow-sm'">

              <!-- Icon indicator -->
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                [ngClass]="{
                  'bg-brand-500/10 border-brand-500/30 text-brand-300': item.type === 'BOOKING',
                  'bg-emerald-500/10 border-emerald-500/30 text-emerald-300': item.type === 'PAYMENT',
                  'bg-amber-500/10 border-amber-500/30 text-amber-300': item.type === 'REVIEW',
                  'bg-purple-500/10 border-purple-500/30 text-purple-300': item.type === 'SYSTEM'
                }">
                <app-icon [name]="getIconForType(item.type)" size="sm"></app-icon>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0 space-y-1">
                <div class="flex items-center justify-between gap-2">
                  <h4 class="text-xs font-bold text-white leading-snug flex items-center gap-2">
                    <span>{{ item.title }}</span>
                    @if (!item.isRead) {
                      <span class="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
                    }
                  </h4>
                  <span class="text-[10px] text-white/40 shrink-0">{{ item.createdAt }}</span>
                </div>
                <p class="text-xs text-white/70 leading-relaxed">{{ item.message }}</p>
              </div>

            </div>
          }
        } @else {
          <div class="glass-panel p-8 rounded-2xl border border-navy-800 text-center text-xs text-white/50">
            Tidak ada notifikasi untuk ditampilkan.
          </div>
        }
      </div>

    </div>
  `
})
export class CustomerNotificationsComponent {
  public readonly notifService = inject(CustomerNotificationService);
  public filterMode = signal<'ALL' | 'UNREAD'>('ALL');

  public displayNotifications = computed(() => {
    const list = this.notifService.customerNotifications();
    if (this.filterMode() === 'UNREAD') {
      return list.filter(n => !n.isRead);
    }
    return list;
  });

  public getIconForType(type: string): string {
    switch (type) {
      case 'BOOKING': return 'calendar';
      case 'PAYMENT': return 'credit-card';
      case 'REVIEW': return 'star';
      case 'SYSTEM':
      default: return 'bell';
    }
  }

  public onNotificationClick(item: any): void {
    this.notifService.markAsRead(item.id);
  }
}
