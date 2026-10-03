import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { RatingComponent } from '../../../shared/components/ui/rating/rating.component';

@Component({
  selector: 'app-customer-reviews',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    PortalPageHeaderComponent,
    RatingComponent
  ],
  template: `
    <div class="space-y-6">
      
      <!-- Page Header -->
      <app-portal-page-header
        categoryLabel="Portal Klien"
        title="Ulasan & Penilaian Advokat"
        subtitle="Berikan ulasan dan testimoni terverifikasi terhadap layanan advokat yang telah mendampingi Anda."
        [breadcrumbs]="[{ label: 'Portal Klien', url: '/portal/customer' }, { label: 'Ulasan Saya' }]">
      </app-portal-page-header>

      <!-- Completed Sessions Review List -->
      <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
        <div class="flex items-center justify-between border-b border-navy-800 pb-3">
          <div>
            <h3 class="text-sm font-bold text-white font-heading">Bambang Sutrisno, S.H., M.H.</h3>
            <p class="text-xs text-white/50">Pendirian PT & Pengurusan NIB OSS RBA • Sesi 25 Sep 2026</p>
          </div>
          <app-rating [rating]="5"></app-rating>
        </div>
        <p class="text-xs text-white/80 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
          "Proses konsultasi pendirian PT berjalan sangat lancar. Penjelasan kualifikasi KBLI dari Pak Bambang sangat sistematis dan mudah dipahami."
        </p>
      </div>

    </div>
  `
})
export class CustomerReviewsComponent {}
