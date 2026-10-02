import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../../core/services/seo.service';
import { LegalRepositoryService } from '../../../core/repositories/legal-repository.service';
import { ContainerComponent, BreadcrumbComponent } from '../../../shared/components/ui';
import { ServiceCardComponent } from '../../../shared/components/domain';
import { LegalService } from '../../../core/models/legal-service.model';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [
    CommonModule, ContainerComponent,
    BreadcrumbComponent, ServiceCardComponent
  ],
  template: `
    <!-- Page Hero -->
    <section class="relative pt-28 pb-16 bg-gradient-to-br from-brand-900 via-navy-800 to-brand-900 text-white overflow-hidden">
      <app-container size="lg" className="relative z-10">
        <app-breadcrumb [items]="[{ label: 'Layanan Hukum' }]"></app-breadcrumb>

        <div class="max-w-3xl mt-4">
          <p class="text-xs font-bold uppercase tracking-wider text-gold-400 mb-3">Direktori Layanan</p>
          <h1 class="font-heading text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
            Solusi Hukum Lengkap<br>
            <span class="text-gradient-gold">untuk Setiap Kebutuhan Anda</span>
          </h1>
          <p class="text-slate-300 text-base md:text-lg leading-relaxed">
            Dari pendirian bisnis hingga hukum keluarga dan pertanahan, terhubung dengan advokat terverifikasi PERADI secara transparan & terjangkau.
          </p>
        </div>
      </app-container>
    </section>

    <!-- Services Grid -->
    <section class="section-padding bg-slate-50">
      <app-container size="lg">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <app-service-card *ngFor="let service of services()" [service]="service"></app-service-card>
        </div>
      </app-container>
    </section>
  `
})
export class ServicesPageComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly repository = inject(LegalRepositoryService);

  public readonly services = signal<LegalService[]>([]);

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Layanan Hukum Terlengkap',
      description: 'Daftar layanan hukum lengkap: Pendirian PT/CV, Kontrak Bisnis, HKI, Perceraian, Waris, hingga Pidana.'
    });

    this.repository.getServices().subscribe(s => this.services.set(s));
  }
}
