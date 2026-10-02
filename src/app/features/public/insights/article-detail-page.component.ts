import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { ContainerComponent, BreadcrumbComponent, BadgeComponent, ButtonComponent } from '../../../shared/components/ui';
import { CTASectionComponent } from '../../../shared/components/layout';

@Component({
  selector: 'app-article-detail-page',
  standalone: true,
  imports: [
    CommonModule, ContainerComponent, BreadcrumbComponent,
    BadgeComponent, CTASectionComponent
  ],
  template: `
    <article class="pt-28 pb-16 bg-white">
      <app-container size="md">
        <app-breadcrumb [items]="[{ label: 'Insight', url: '/insights' }, { label: 'Detail Artikel' }]"></app-breadcrumb>

        <header class="mt-6 mb-8">
          <app-badge variant="brand" size="sm" className="mb-4">Hukum Bisnis</app-badge>
          <h1 class="font-heading text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            Panduan Lengkap Mendirikan PT di Indonesia Tahun 2024: Persyaratan, Biaya, dan Prosedur Terbaru
          </h1>
          <div class="flex items-center gap-4 text-xs text-slate-500 pb-6 border-b border-slate-200">
            <span>Oleh <strong>Bambang Sutrisno, S.H., M.H.</strong></span>
            <span>•</span>
            <span>24 September 2024</span>
            <span>•</span>
            <span>12 mnt membaca</span>
          </div>
        </header>

        <div class="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6">
          <p class="text-base md:text-lg font-medium text-slate-800 leading-relaxed">
            Mendirikan Perseroan Terbatas (PT) merupakan langkah krusial bagi para pelaku usaha di Indonesia untuk melegalkan bisnis, melindungi aset pribadi, dan membangun kredibilitas di mata investor maupun mitra bisnis.
          </p>

          <h2 class="font-heading font-bold text-2xl text-slate-900 pt-4">1. Persyaratan Utama Pendirian PT</h2>
          <p>Sesuai dengan regulasi KBLI dan OSS RBA terbaru, pendirian PT Perorangan maupun PT Persekutuan Modal membutuhkan dokumen dasar antara lain KTP pendiri, NPWP, pilihan nama PT minimal 3 kata dalam Bahasa Indonesia, serta penetapan domisili usaha.</p>

          <h2 class="font-heading font-bold text-2xl text-slate-900 pt-4">2. Prosedur Akta Notaris & SK Kemenkumham</h2>
          <p>Proses dimulai dengan pemesanan nama PT di Kemenkumham, dilanjutkan pembuatan Akta Pendirian di hadapan Notaris, hingga terbitnya Surat Keputusan (SK) Pengesahan Badan Hukum dari Menteri Hukum dan HAM.</p>
        </div>
      </app-container>
    </article>

    <app-cta-section
      title="Butuh Pendampingan Hukum Bisnis?"
      subtitle="Konsultasikan pendirian PT / CV Anda dengan advokat korporasi berpengalaman."
      primaryLabel="Konsultasi Advokat"
      primaryRoute="/professionals">
    </app-cta-section>
  `
})
export class ArticleDetailPageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Panduan Lengkap Mendirikan PT di Indonesia 2024',
      description: 'Panduan lengkap pendirian PT di Indonesia: syarat, biaya, Akta Notaris, SK Kemenkumham, dan NIB OSS RBA.'
    });
  }
}
