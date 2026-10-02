import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import {
  ContainerComponent, BreadcrumbComponent, BadgeComponent,
  ButtonComponent, SearchFieldComponent
} from '../../../shared/components/ui';
import { ArticleCardComponent, ArticleItem } from '../../../shared/components/domain/article-card/article-card.component';
import { CTASectionComponent } from '../../../shared/components/layout';

@Component({
  selector: 'app-insights-page',
  standalone: true,
  imports: [
    CommonModule, ContainerComponent, BreadcrumbComponent,
    BadgeComponent, SearchFieldComponent, ArticleCardComponent,
    CTASectionComponent
  ],
  template: `
    <!-- Hero Header -->
    <section class="pt-28 pb-16 bg-gradient-to-br from-brand-900 via-navy-800 to-brand-900 text-white">
      <app-container size="lg">
        <app-breadcrumb [items]="[{ label: 'Insight & Edukasi' }]"></app-breadcrumb>

        <div class="max-w-3xl mt-4">
          <h1 class="font-heading text-4xl md:text-5xl font-bold mb-4">
            Artikel & <span class="text-gradient-gold">Edukasi Hukum</span>
          </h1>
          <p class="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
            Panduan hukum praktis, ulasan regulasi terbaru, dan artikel ilmiah dari advokat profesional LegalConnect.
          </p>
        </div>

        <div class="max-w-2xl">
          <app-search-field
            placeholder="Cari artikel hukum (mis. PT, PHK, Merek HKI)..."
            (search)="searchQuery.set($event)">
          </app-search-field>
        </div>
      </app-container>
    </section>

    <!-- Categories Tab Bar -->
    <section class="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
      <app-container size="lg">
        <div class="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          <button
            *ngFor="let cat of categories"
            type="button"
            class="shrink-0 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200"
            [ngClass]="activeCategory() === cat ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            (click)="activeCategory.set(cat)">
            {{ cat }}
          </button>
        </div>
      </app-container>
    </section>

    <!-- Main Articles Grid -->
    <section class="section-padding bg-slate-50">
      <app-container size="lg">
        
        <!-- Featured Article Banner -->
        <div *ngIf="featuredArticle() && activeCategory() === 'Semua'" class="glass-panel-dark rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden bg-gradient-to-r from-brand-900 via-navy-900 to-brand-800 text-white">
          <div class="max-w-2xl relative z-10">
            <app-badge variant="gold" size="sm" className="mb-4">Artikel Pilihan Utama</app-badge>
            <h2 class="font-heading text-2xl md:text-4xl font-extrabold mb-4 leading-tight">
              {{ featuredArticle()!.title }}
            </h2>
            <p class="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
              {{ featuredArticle()!.excerpt }}
            </p>
            <div class="flex items-center gap-4 text-xs text-slate-400 mb-6">
              <span>Oleh {{ featuredArticle()!.authorName }}</span>
              <span>•</span>
              <span>{{ featuredArticle()!.publishedAt }}</span>
              <span>•</span>
              <span>{{ featuredArticle()!.readTime }} mnt baca</span>
            </div>
          </div>
        </div>

        <!-- Articles Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <app-article-card *ngFor="let article of filteredArticles()" [article]="article"></app-article-card>
        </div>

      </app-container>
    </section>

    <!-- CTA Banner -->
    <app-cta-section
      title="Punya Pertanyaan Hukum Spesifik?"
      subtitle="Konsultasikan situasi kasus Anda langsung dengan advokat ahli."
      primaryLabel="Konsultasi Sekarang"
      primaryRoute="/professionals">
    </app-cta-section>
  `
})
export class InsightsPageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  public readonly activeCategory = signal<string>('Semua');
  public readonly searchQuery = signal<string>('');

  public readonly categories = ['Semua', 'Hukum Bisnis', 'Hukum Keluarga', 'HKI', 'Ketenagakerjaan', 'Properti'];

  public readonly featuredArticle = signal<ArticleItem | null>({
    id: '1', slug: 'cara-mendirikan-pt-di-indonesia-2024', title: 'Panduan Lengkap Mendirikan PT di Indonesia Tahun 2024: Syarat & Prosedur', excerpt: 'Mendirikan Perseroan Terbatas (PT) di Indonesia memerlukan pemahaman regulasi KBLI dan OSS RBA terbaru. Simak panduan komprehensif dari advokat korporasi kami.', category: 'Hukum Bisnis', authorName: 'Bambang Sutrisno, S.H., M.H.', publishedAt: '24 Sep 2024', readTime: 12
  });

  public readonly articles: ArticleItem[] = [
    { id: '2', slug: 'hak-karyawan-phk-uu-ciptakerja', title: '5 Hak Karyawan saat PHK di Era UU Cipta Kerja', excerpt: 'Pahami hak pesangon, uang penghargaan masa kerja, dan ganti kerugian sesuai aturan hukum ketenagakerjaan.', category: 'Ketenagakerjaan', authorName: 'Hendra Wijaya, S.H.', publishedAt: '20 Sep 2024', readTime: 8 },
    { id: '3', slug: 'cara-daftarkan-merek-dagang-indonesia', title: 'Cara Mendaftarkan Merek Dagang di DJKI Kemenkumham', excerpt: 'Melindungi merek bisnis Anda adalah investasi vital. Berikut langkah penelusuran nama dan pendaftaran merek.', category: 'HKI', authorName: 'Rina Kusuma, S.H.', publishedAt: '15 Sep 2024', readTime: 10 },
    { id: '4', slug: 'harta-gono-gini-perceraian', title: 'Pembagian Harta Gana-Gini saat Perceraian', excerpt: 'Pahami kriteria harta bersama, pemisahan harta, dan opsi mediasi kekeluargaan di pengadilan.', category: 'Hukum Keluarga', authorName: 'Dr. Anisa Rahmawati, S.H.', publishedAt: '10 Sep 2024', readTime: 9 },
    { id: '5', slug: 'due-diligence-properti-sebelum-beli', title: '7 Hal yang Wajib Dicek Sebelum Membeli Tanah', excerpt: 'Tips due diligence sertifikat tanah di BPN agar terhindar dari sengketa sengketa sertifikat ganda.', category: 'Properti', authorName: 'Maya Santoso, S.H.', publishedAt: '5 Sep 2024', readTime: 11 },
    { id: '6', slug: 'kontrak-kerja-freelancer-penting', title: 'Klausul Penting dalam Kontrak Kerja Freelancer', excerpt: 'Bagi para pekerja independen, perjanjian tertulis adalah perlindungan utama pembayaran tepat waktu.', category: 'Hukum Bisnis', authorName: 'Bambang Sutrisno, S.H.', publishedAt: '1 Sep 2024', readTime: 7 }
  ];

  public readonly filteredArticles = computed(() => {
    let result = this.articles;
    const cat = this.activeCategory();
    const q = this.searchQuery().toLowerCase().trim();

    if (cat !== 'Semua') {
      result = result.filter(a => a.category === cat);
    }
    if (q) {
      result = result.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
    }
    return result;
  });

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Artikel & Edukasi Hukum',
      description: 'Baca artikel hukum informatif dari advokat berpengalaman. Panduan praktis tentang bisnis, keluarga, HKI, ketenagakerjaan, dan properti di Indonesia.',
      keywords: ['artikel hukum indonesia', 'edukasi hukum', 'panduan hukum bisnis', 'tips hukum keluarga']
    });
  }
}
