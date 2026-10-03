import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProBookingService } from '../../../core/services/pro-booking.service';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-pro-reviews',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PortalPageHeaderComponent,
    ButtonComponent,
    IconComponent
  ],
  template: `
    <div class="space-y-8">
      <!-- Page Header -->
      <app-portal-page-header
        categoryLabel="Legal Professional Portal"
        title="Ulasan & Reputasi Advokat"
        subtitle="Kelola ulasan dan penilaian kepuasan dari klien yang telah menyelesaikan sesi konsultasi dengan Anda."
        [breadcrumbs]="[{ label: 'Portal Advokat', url: '/portal/pro' }, { label: 'Ulasan & Rating' }]">
      </app-portal-page-header>

      <!-- Rating Summary & Statistics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-panel p-6 rounded-2xl border border-navy-800 text-center space-y-2 flex flex-col items-center justify-center">
          <div class="text-4xl font-extrabold text-white font-heading">{{ proService.averageRating() || '5.0' }}</div>
          <div class="flex items-center gap-1 text-gold-400">
            @for (star of [1, 2, 3, 4, 5]; track star) {
              <app-icon name="star" size="sm" class="fill-gold-400"></app-icon>
            }
          </div>
          <div class="text-xs text-white/50 font-medium">Rata-rata Rating Klien</div>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-navy-800 md:col-span-2 space-y-3 flex flex-col justify-center">
          <h4 class="text-sm font-semibold text-white font-heading">Kepuasan Pelayanan</h4>
          <p class="text-xs text-white/60 leading-relaxed">Ulasan positif meningkatkan visibilitas profil Anda pada pencarian publik Legalinesia dan membangun reputasi kepercayaan publik.</p>
          <div class="text-xs text-brand-400 font-medium">Total {{ proService.reviews().length }} Ulasan Masuk</div>
        </div>
      </div>

      <!-- Reviews List -->
      @if (proService.reviews().length > 0) {
        <div class="space-y-4">
          @for (rev of proService.reviews(); track rev.id) {
            <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
              <div class="flex items-center justify-between border-b border-navy-800 pb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-brand-500/20 text-brand-300 font-bold flex items-center justify-center text-sm border border-brand-500/30">
                    {{ rev.clientName.charAt(0) }}
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-white">{{ rev.clientName }}</div>
                    <div class="text-xs text-white/50 font-mono">Layanan: {{ rev.serviceTitle }}</div>
                  </div>
                </div>

                <div class="flex items-center gap-1 text-gold-400">
                  @for (star of [1,2,3,4,5]; track star) {
                    <app-icon name="star" size="xs" [class]="star <= rev.rating ? 'text-gold-400 fill-gold-400' : 'text-navy-700'"></app-icon>
                  }
                  <span class="text-xs text-white font-bold ml-1">{{ rev.rating }}.0</span>
                </div>
              </div>

              <!-- Review Comment -->
              <p class="text-xs text-white/80 leading-relaxed italic">"{{ rev.comment }}"</p>

              <!-- Advocate Reply Section -->
              @if (rev.reply) {
                <div class="bg-navy-950/80 p-4 rounded-xl border border-navy-800 space-y-1">
                  <div class="flex items-center gap-1.5 text-xs text-brand-400 font-semibold">
                    <app-icon name="shield-check" size="xs"></app-icon>
                    <span>Tanggapan Anda:</span>
                  </div>
                  <p class="text-xs text-white/70 leading-relaxed">{{ rev.reply }}</p>
                </div>
              } @else {
                <div class="pt-2">
                  <app-button variant="outline" size="xs" iconLeft="corner-down-right" (click)="onReply(rev.id)">Beri Tanggapan Resmi</app-button>
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="glass-panel p-12 text-center rounded-2xl border border-navy-800 space-y-3">
          <div class="w-14 h-14 rounded-full bg-navy-800 text-white/40 flex items-center justify-center mx-auto">
            <app-icon name="star" size="lg"></app-icon>
          </div>
          <h3 class="text-base font-semibold text-white">Belum ada ulasan</h3>
          <p class="text-xs text-white/50 max-w-sm mx-auto">Ulasan dari klien akan otomatis tertampil setelah sesi konsultasi diselesaikan oleh kedua belah pihak.</p>
        </div>
      }
    </div>
  `
})
export class ProReviewsComponent {
  public readonly proService = inject(ProBookingService);

  public onReply(reviewId: string): void {
    const text = prompt('Masukkan balasan/tanggapan resmi Anda untuk ulasan ini:');
    if (text) {
      this.proService.addReviewReply(reviewId, text);
    }
  }
}
