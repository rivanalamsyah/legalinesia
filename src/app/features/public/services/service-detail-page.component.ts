import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { LegalRepositoryService } from '../../../core/repositories/legal-repository.service';
import {
  ContainerComponent, BreadcrumbComponent, BadgeComponent,
  ButtonComponent, AccordionComponent, AccordionItem, EmptyStateComponent
} from '../../../shared/components/ui';
import { CTASectionComponent } from '../../../shared/components/layout';
import { CurrencyIdrPipe } from '../../../shared/pipes/currency-idr.pipe';
import { LegalService } from '../../../core/models/legal-service.model';

@Component({
  selector: 'app-service-detail-page',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ContainerComponent, BreadcrumbComponent,
    BadgeComponent, ButtonComponent, CurrencyIdrPipe,
    CTASectionComponent, EmptyStateComponent
  ],
  template: `
    <section *ngIf="service()" class="pt-28 pb-16 bg-gradient-to-br from-brand-900 via-navy-800 to-brand-900 text-white">
      <app-container size="lg">
        <app-breadcrumb [items]="[{ label: 'Layanan Hukum', url: '/services' }, { label: service()!.title }]"></app-breadcrumb>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6 items-center">
          <div class="lg:col-span-8">
            <app-badge variant="gold" size="sm" className="mb-4">{{ service()!.categoryName }}</app-badge>
            <h1 class="font-heading text-3xl md:text-5xl font-extrabold mb-4 leading-tight text-white">
              {{ service()!.title }}
            </h1>
            <p class="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
              {{ service()!.description }}
            </p>
          </div>

          <div class="lg:col-span-4">
            <div class="glass-panel-dark p-6 rounded-3xl border border-white/10 text-white">
              <span class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mulai Dari</span>
              <div class="font-heading font-extrabold text-3xl text-gold-400 mb-2">
                {{ service()!.startingPrice | currencyIdr }}
              </div>
              <p class="text-xs text-slate-300 mb-6 font-medium">Estimasi Waktu: {{ service()!.estimatedDuration }}</p>

              <app-button
                [routerLink]="['/booking']"
                [queryParams]="{ serviceId: service()!.id }"
                variant="gold"
                size="lg"
                [fullWidth]="true">
                Pesan Layanan Sekarang
              </app-button>
            </div>
          </div>
        </div>
      </app-container>
    </section>

    <!-- Scope & Process Section -->
    <section *ngIf="service()" class="section-padding bg-slate-50">
      <app-container size="lg">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div class="lg:col-span-8 space-y-8">
            <div class="surface-card p-6 md:p-8">
              <h2 class="font-heading font-bold text-xl text-slate-900 mb-4">Ruang Lingkup Layanan</h2>
              <ul class="space-y-3">
                <li *ngFor="let item of service()!.keyFeatures" class="flex items-start gap-3 text-sm text-slate-700">
                  <span class="text-emerald-500 font-bold">✓</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <div class="surface-card p-6 md:p-8">
              <h2 class="font-heading font-bold text-xl text-slate-900 mb-4">Dokumen Deliverables yang Diterima</h2>
              <ul class="space-y-3">
                <li *ngFor="let item of service()!.deliverables" class="flex items-start gap-3 text-sm text-slate-700">
                  <span class="text-brand-600 font-bold">📄</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="lg:col-span-4 space-y-6">
            <div class="surface-card p-6">
              <h3 class="font-heading font-bold text-base text-slate-900 mb-3">Direkomendasikan Untuk</h3>
              <div class="flex flex-wrap gap-2">
                <app-badge *ngFor="let rec of service()!.recommendedFor" variant="neutral" size="sm">
                  {{ rec }}
                </app-badge>
              </div>
            </div>
          </div>

        </div>
      </app-container>
    </section>

    <app-empty-state
      *ngIf="!service() && !isLoading"
      icon="alert-circle"
      title="Layanan Tidak Ditemukan"
      description="Layanan yang Anda cari tidak tersedia."
      actionLabel="Kembali ke Layanan"
      (actionClick)="goBack()">
    </app-empty-state>

    <app-cta-section
      *ngIf="service()"
      title="Butuh Advokat Pendamping Kasus Ini?"
      subtitle="Jadwalkan konsultasi dengan advokat spesialis berlisensi hari ini."
      primaryLabel="Pilih Advokat Pendamping"
      primaryRoute="/professionals">
    </app-cta-section>
  `
})
export class ServiceDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly repository = inject(LegalRepositoryService);
  private readonly seo = inject(SeoService);

  public readonly service = signal<LegalService | undefined>(undefined);
  public isLoading = true;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.repository.getServiceById(slug).subscribe(srv => {
          this.service.set(srv);
          this.isLoading = false;
          if (srv) {
            this.seo.updateSeo({
              title: srv.title,
              description: srv.description
            });
          }
        });
      }
    });
  }

  public goBack(): void {
    window.history.back();
  }
}
