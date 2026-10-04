import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { LegalRepositoryService } from '../../../core/repositories/legal-repository.service';
import { ReviewItem } from '../../../core/services/mock-data.service';
import {
  ContainerComponent, ButtonComponent, BadgeComponent, IconComponent,
  SectionHeaderComponent, SearchFieldComponent, AccordionComponent,
  AccordionItem
} from '../../../shared/components/ui';
import {
  ProfessionalCardComponent, ServiceCardComponent, TestimonialCardComponent
} from '../../../shared/components/domain';
import { LegalProfessional } from '../../../core/models/legal-professional.model';
import { LegalService } from '../../../core/models/legal-service.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ContainerComponent, ButtonComponent,
    BadgeComponent, IconComponent, SectionHeaderComponent, SearchFieldComponent,
    AccordionComponent, ProfessionalCardComponent, ServiceCardComponent, TestimonialCardComponent
  ],
  template: `
    <!-- 1. HERO SECTION -->
    <section class="relative min-h-[92vh] flex items-center bg-gradient-to-br from-navy-950 via-brand-900 to-navy-900 text-white overflow-hidden" aria-labelledby="hero-heading">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-20 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 left-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl"></div>
      </div>

      <app-container size="lg" className="pt-32 pb-20 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div class="lg:col-span-7">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <app-icon name="shield-check" size="xs"></app-icon>
              <span>Platform Legal-Tech #1 Indonesia</span>
            </div>

            <h1 id="hero-heading" class="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
              Konsultasi Hukum <span class="text-gradient-gold">Transparan & Terpercaya</span>
            </h1>

            <p class="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
              Terhubung langsung dengan advokat profesional berlisensi PERADI. Selesaikan permasalahan hukum perdata, bisnis, perceraian, HKI, hingga pidana secara fleksibel & aman.
            </p>

            <div class="max-w-xl mb-8">
              <app-search-field
                placeholder="Cari spesialisasi advokat (mis. Perceraian, PT/CV, HKI)..."
                (search)="onHeroSearch($event)">
              </app-search-field>
            </div>

            <div class="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-300">
              <div class="flex items-center gap-2">
                <app-icon name="check-circle-2" size="xs" class="text-emerald-400"></app-icon>
                <span>Advokat Berlisensi PERADI</span>
              </div>
              <div class="flex items-center gap-2">
                <app-icon name="check-circle-2" size="xs" class="text-emerald-400"></app-icon>
                <span>Kerahasiaan Klien Dijamin</span>
              </div>
              <div class="flex items-center gap-2">
                <app-icon name="check-circle-2" size="xs" class="text-emerald-400"></app-icon>
                <span>Garansi Respon & Transparan</span>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5">
            <div class="glass-panel-dark rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-white/10">
              <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <h2 class="font-heading font-bold text-lg text-white">Status Advokat Online</h2>
                  <p class="text-xs text-slate-400">Siap berkonsultasi hari ini</p>
                </div>
                <app-badge variant="success" size="sm">Live</app-badge>
              </div>

              <div class="space-y-4">
                <div *ngFor="let lawyer of topLawyers() | slice:0:3" class="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                      {{ lawyer.fullName.substring(0,2) }}
                    </div>
                    <div>
                      <h3 class="font-bold text-white text-sm">{{ lawyer.fullName }}</h3>
                      <p class="text-xs text-slate-400">{{ lawyer.specializations[0] }} • {{ lawyer.locationCity }}</p>
                    </div>
                  </div>
                  <app-button [routerLink]="['/booking']" [queryParams]="{ lawyerId: lawyer.id }" variant="gold" size="sm">
                    Pilih
                  </app-button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </app-container>
    </section>

    <!-- 2. PROBLEM FINDER SECTION -->
    <section class="py-12 bg-white border-b border-slate-200">
      <app-container size="lg">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 class="font-heading font-bold text-lg text-slate-900">Apa Masalah Hukum Anda?</h2>
            <p class="text-xs text-slate-500">Pilih topik untuk langsung terhubung dengan advokat spesialis</p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              *ngFor="let problem of problemTopics"
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 transition-colors"
              (click)="onProblemClick(problem.query)">
              {{ problem.label }}
            </button>
          </div>
        </div>
      </app-container>
    </section>

    <!-- 3. PRACTICE AREAS SECTION -->
    <section class="section-padding bg-slate-50">
      <app-container size="lg">
        <app-section-header
          title="Bidang Spesialisasi Hukum"
          subtitle="Advokat ahli di berbagai bidang hukum perdata, pidana, korporasi, hingga HKI"
          badge="Bidang Keahlian"
          [centered]="true">
        </app-section-header>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <div *ngFor="let area of practiceAreas" class="surface-card p-6 flex flex-col justify-between hover:border-brand-400 group">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition-all">
                <app-icon [name]="area.icon" size="md"></app-icon>
              </div>
              <h3 class="font-heading font-bold text-lg text-slate-900 group-hover:text-brand-600 mb-2">{{ area.name }}</h3>
              <p class="text-xs text-slate-600 leading-relaxed mb-4">{{ area.description }}</p>
            </div>
            <a routerLink="/professionals" [queryParams]="{ q: area.name }" class="text-xs font-bold text-brand-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Lihat Advokat {{ area.name }} <app-icon name="arrow-right" size="xs"></app-icon>
            </a>
          </div>
        </div>
      </app-container>
    </section>

    <!-- 4. POPULAR SERVICES SECTION -->
    <section class="section-padding bg-white">
      <app-container size="lg">
        <app-section-header
          title="Layanan Hukum Populer"
          subtitle="Paket layanan legalitas dan konsultasi terstruktur dengan tarif transparan"
          badge="Layanan Pilihan"
          [centered]="true">
        </app-section-header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <app-service-card *ngFor="let service of featuredServices()" [service]="service"></app-service-card>
        </div>
      </app-container>
    </section>

    <!-- 5. HOW IT WORKS SECTION -->
    <section class="section-padding bg-slate-900 text-white">
      <app-container size="lg">
        <app-section-header
          title="Cara Kerja Konsultasi"
          subtitle="4 langkah mudah berkonsultasi secara resmi dan terproteksi"
          badge="Prosedur Mudah"
          [centered]="true">
        </app-section-header>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          <div *ngFor="let step of workflowSteps" class="bg-white/5 border border-white/10 rounded-2xl p-6 relative">
            <span class="w-8 h-8 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center mb-4">
              0{{ step.number }}
            </span>
            <h3 class="font-heading font-bold text-lg mb-2">{{ step.title }}</h3>
            <p class="text-xs text-slate-300 leading-relaxed">{{ step.description }}</p>
          </div>
        </div>
      </app-container>
    </section>

    <!-- 6. FEATURED PROFESSIONALS DIRECTORY -->
    <section class="section-padding bg-slate-50">
      <app-container size="lg">
        <app-section-header
          title="Advokat Berlisensi Terbaik"
          subtitle="Direktori advokat terverifikasi PERADI dengan rating dan ulasan riil"
          badge="Direktori Advokat"
          [centered]="true">
        </app-section-header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <app-professional-card *ngFor="let lawyer of topLawyers() | slice:0:3" [lawyer]="lawyer"></app-professional-card>
        </div>
      </app-container>
    </section>

    <!-- 7. WHY LEGALINESIA (TRUST PILLARS) -->
    <section class="section-padding bg-white">
      <app-container size="lg">
        <app-section-header
          title="Mengapa Memilih Legalinesia?"
          subtitle="Jaminan integritas, keamanan data, dan kepastian biaya di setiap proses hukum Anda"
          badge="Keunggulan"
          [centered]="true">
        </app-section-header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div *ngFor="let pillar of trustPillars" class="surface-card p-8 text-center">
            <div class="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-5">
              <app-icon [name]="pillar.icon" size="lg"></app-icon>
            </div>
            <h3 class="font-heading font-bold text-xl text-slate-900 mb-3">{{ pillar.title }}</h3>
            <p class="text-sm text-slate-600 leading-relaxed">{{ pillar.description }}</p>
          </div>
        </div>
      </app-container>
    </section>

    <!-- 8. TRANSPARENT PRICING & FLOW COMPARISON -->
    <section class="section-padding bg-slate-50">
      <app-container size="lg">
        <app-section-header
          title="Perbandingan Konsultasi"
          subtitle="Lihat bagaimana Legalinesia mempermudah akses hukum dibanding metode tradisional"
          badge="Inovasi Digital"
          [centered]="true">
        </app-section-header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
          <div class="surface-card p-8 border-red-200 bg-red-50/20">
            <h3 class="font-heading font-bold text-lg text-red-900 mb-4 flex items-center gap-2">
              <app-icon name="x-circle" size="md" class="text-red-500"></app-icon>
              Cara Tradisional Offline
            </h3>
            <ul class="space-y-3 text-xs md:text-sm text-slate-700">
              <li class="flex items-start gap-2"><span>❌</span> Sulit memverifikasi lisensi & rekam jejak advokat</li>
              <li class="flex items-start gap-2"><span>❌</span> Biaya konsultasi tidak pasti & sering ada fee tersembunyi</li>
              <li class="flex items-start gap-2"><span>❌</span> Harus datang ke kantor hukum & membuang waktu macet</li>
            </ul>
          </div>

          <div class="surface-card p-8 border-brand-300 bg-brand-50/30">
            <h3 class="font-heading font-bold text-lg text-brand-900 mb-4 flex items-center gap-2">
              <app-icon name="check-circle-2" size="md" class="text-emerald-600"></app-icon>
              Legalinesia Digital
            </h3>
            <ul class="space-y-3 text-xs md:text-sm text-slate-700">
              <li class="flex items-start gap-2"><span>✅</span> 100% Advokat Berlisensi PERADI Terverifikasi</li>
              <li class="flex items-start gap-2"><span>✅</span> Biaya transparan mulai Rp 300rb/30 menit</li>
              <li class="flex items-start gap-2"><span>✅</span> Konsultasi online dari mana saja via Chat / Video Call</li>
            </ul>
          </div>
        </div>
      </app-container>
    </section>

    <!-- 9. TESTIMONIALS SECTION -->
    <section class="section-padding bg-slate-900 text-white">
      <app-container size="lg">
        <app-section-header
          title="Ulasan Klien Terverifikasi"
          subtitle="Pengalaman riil dari klien yang telah berkonsultasi via Legalinesia"
          badge="Testimoni"
          [centered]="true">
        </app-section-header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <app-testimonial-card *ngFor="let review of testimonials()" [review]="review"></app-testimonial-card>
        </div>
      </app-container>
    </section>

    <!-- 10. FAQ SECTION PREVIEW -->
    <section class="section-padding bg-slate-50">
      <app-container size="md">
        <app-section-header
          title="Pertanyaan Sering Diajukan"
          subtitle="Jawaban atas pertanyaan seputar konsultasi hukum online"
          badge="Bantuan FAQ"
          [centered]="true">
        </app-section-header>

        <div class="mt-12">
          <app-accordion [items]="faqItems"></app-accordion>
        </div>
      </app-container>
    </section>

    <!-- 11. FINAL CONTACT CTA -->
    <section class="py-16 bg-gradient-to-r from-brand-700 to-navy-900 text-white text-center">
      <app-container size="lg">
        <h2 class="font-heading text-3xl md:text-4xl font-extrabold mb-4">Butuh Bantuan Hukum Sekarang?</h2>
        <p class="text-slate-200 text-base max-w-xl mx-auto mb-8">Tim konsultan dan advokat kami siap mendampingi permasalahan hukum Anda.</p>
        <div class="flex justify-center gap-4">
          <app-button routerLink="/professionals" variant="gold" size="lg">Cari Advokat Sekarang</app-button>
        </div>
      </app-container>
    </section>
  `
})
export class HomePageComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly repository = inject(LegalRepositoryService);
  private readonly router = inject(Router);

  public readonly featuredServices = signal<LegalService[]>([]);
  public readonly topLawyers = signal<LegalProfessional[]>([]);
  public readonly testimonials = signal<ReviewItem[]>([]);

  public readonly problemTopics = [
    { label: 'Mendirikan PT / CV', query: 'Pendirian PT' },
    { label: 'Perceraian & Hak Asuh', query: 'Perceraian' },
    { label: 'Pendaftaran Merek HKI', query: 'HKI' },
    { label: 'Sengketa Pertanahan', query: 'Pertanahan' },
    { label: 'Penanganan PHK', query: 'Ketenagakerjaan' },
    { label: 'Draf Kontrak Bisnis', query: 'Kontrak' }
  ];

  public readonly practiceAreas = [
    { name: 'Hukum Perdata', icon: 'scale', description: 'Penyelesaian sengketa perjanjian, utang-piutang, dan gugatan ganti rugi.' },
    { name: 'Hukum Bisnis & Korporasi', icon: 'building-2', description: 'Legalitas PT/CV, draf kontrak, merger, dan kepatuhan hukum perusahaan.' },
    { name: 'Perceraian & Keluarga', icon: 'users', description: 'Pengurusan perceraian, hak asuh anak, dan pembagian harta gana-gini.' },
    { name: 'Hak Kekayaan Intelektual', icon: 'award', description: 'Pendaftaran merek usaha, hak cipta karya, paten, dan rahasia dagang.' },
    { name: 'Hukum Pertanahan & Properti', icon: 'map-pin', description: 'Pengecekan sertifikat, sengketa lahan, dan jual-beli properti.' },
    { name: 'Hukum Pidana', icon: 'shield', description: 'Pendampingan kepolisian, kejaksaan, hingga persidangan di pengadilan.' }
  ];

  public readonly workflowSteps = [
    { number: 1, title: 'Cari & Pilih Advokat', description: 'Pilih advokat berlisensi PERADI sesuai bidang spesialisasi dan lokasi Anda.' },
    { number: 2, title: 'Jadwalkan Konsultasi', description: 'Pilih waktu konsultasi yang fleksibel via Video Call atau Chat Online.' },
    { number: 3, title: 'Pembayaran Rekber Aman', description: 'Bayar melalui rekening terproteksi. Dana aman dan transparan.' },
    { number: 4, title: 'Sesi & Solusi Hukum', description: 'Dapatkan nasihat hukum resmi beserta dokumen penanganan kasus.' }
  ];

  public readonly trustPillars = [
    { icon: 'shield-check', title: 'Advokat PERADI Terverifikasi', description: 'Seluruh advokat wajib melampirkan KTPA PERADI & Berita Acara Sumpah resmi.' },
    { icon: 'lock', title: 'Kerahasiaan End-to-End', description: 'Diskusi dilindungi oleh asas Attorney-Client Privilege dan enkripsi data data.' },
    { icon: 'credit-card', title: 'Transparansi Biaya', description: 'Tanpa biaya tersembunyi. Pembayaran transparan sebelum sesi dimulai.' }
  ];

  public readonly faqItems: AccordionItem[] = [
    {
      id: 'faq-1',
      title: 'Apakah advokat di Legalinesia resmi dan berlisensi?',
      content: 'Ya, seluruh advokat yang terdaftar di Legalinesia telah melalui proses verifikasi ketat identitas KTP, keanggotaan organisasi advokat PERADI, dan Berita Acara Sumpah (BAS) Pengadilan Tinggi.',
      isOpen: true
    },
    {
      id: 'faq-2',
      title: 'Bagaimana cara melakukan konsultasi hukum online?',
      content: 'Anda cukup memilih layanan atau advokat yang diinginkan, memilih jadwal yang tersedia, dan menyelesaikan pembayaran. Konsultasi dilakukan via video call atau chat terenkripsi.',
      isOpen: false
    }
  ];

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Platform Konsultasi Hukum & Direktori Advokat Terpercaya',
      description: 'Solusi konsultasi hukum online terpercaya di Indonesia. Terhubung langsung dengan advokat berlisensi PERADI.'
    });

    this.repository.getServices().subscribe(s => this.featuredServices.set(s));
    this.repository.getLawyers().subscribe(l => this.topLawyers.set(l));
    this.repository.getReviews().subscribe(r => this.testimonials.set(r));
  }

  public onHeroSearch(query: string): void {
    if (query) {
      this.router.navigate(['/professionals'], { queryParams: { q: query } });
    }
  }

  public onProblemClick(query: string): void {
    this.router.navigate(['/services'], { queryParams: { cat: query } });
  }
}
