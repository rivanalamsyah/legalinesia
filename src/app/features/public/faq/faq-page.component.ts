import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../../core/services/seo.service';
import {
  ContainerComponent, BreadcrumbComponent, SearchFieldComponent,
  AccordionComponent, AccordionItem
} from '../../../shared/components/ui';
import { CTASectionComponent } from '../../../shared/components/layout';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [
    CommonModule, ContainerComponent, BreadcrumbComponent,
    SearchFieldComponent, AccordionComponent, CTASectionComponent
  ],
  template: `
    <!-- Hero Header -->
    <section class="pt-28 pb-16 bg-gradient-to-br from-brand-900 via-navy-800 to-brand-900 text-white">
      <app-container size="lg">
        <app-breadcrumb [items]="[{ label: 'Pusat Bantuan & FAQ' }]"></app-breadcrumb>

        <div class="max-w-3xl mt-4">
          <h1 class="font-heading text-4xl md:text-5xl font-bold mb-4">
            Pusat <span class="text-gradient-gold">Bantuan & FAQ</span>
          </h1>
          <p class="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
            Temukan jawaban cepat seputar pemesanan, pembayaran escrow, lisensi advokat, dan kerahasiaan data.
          </p>
        </div>

        <div class="max-w-2xl">
          <app-search-field
            placeholder="Cari pertanyaan Anda..."
            (search)="searchQuery.set($event)">
          </app-search-field>
        </div>
      </app-container>
    </section>

    <!-- FAQ Categories & Accordion Grid -->
    <section class="section-padding bg-slate-50">
      <app-container size="md">
        
        <!-- Category Filter Chips -->
        <div class="flex flex-wrap justify-center gap-2 mb-10">
          <button
            *ngFor="let cat of categories"
            type="button"
            class="px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200"
            [ngClass]="activeCategory() === cat.key ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'"
            (click)="activeCategory.set(cat.key)">
            {{ cat.label }}
          </button>
        </div>

        <!-- Accordion Component -->
        <app-accordion [items]="accordionItems()" [allowMultiple]="false"></app-accordion>

      </app-container>
    </section>

    <!-- CTA Section -->
    <app-cta-section
      title="Pertanyaan Anda Belum Terjawab?"
      subtitle="Tim support kami siap membantu Anda 24/7."
      primaryLabel="Hubungi Support"
      primaryRoute="/contact">
    </app-cta-section>
  `
})
export class FaqPageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  public readonly activeCategory = signal<string>('ALL');
  public readonly searchQuery = signal<string>('');

  public readonly categories = [
    { key: 'ALL', label: 'Semua Pertanyaan' },
    { key: 'GENERAL', label: 'Umum & Layanan' },
    { key: 'BOOKING', label: 'Pemesanan & Jadwal' },
    { key: 'PAYMENT', label: 'Pembayaran Escrow' },
    { key: 'PRIVACY', label: 'Privasi & Keamanan' },
    { key: 'VERIFICATION', label: 'Verifikasi Advokat' }
  ];

  private readonly allFaqs = [
    { id: '1', category: 'GENERAL', title: 'Apa itu LegalConnect dan bagaimana cara kerjanya?', content: 'LegalConnect adalah platform digital yang menghubungkan masyarakat Indonesia dengan advokat berlisensi PERADI secara transparan, mudah, dan aman.' },
    { id: '2', category: 'GENERAL', title: 'Apakah LegalConnect terdaftar dan legal di Indonesia?', content: 'Ya. LegalConnect beroperasi sesuai regulasi hukum Indonesia dan seluruh advokat di platform kami memiliki lisensi resmi aktif PERADI.' },
    { id: '3', category: 'BOOKING', title: 'Bagaimana cara memesan konsultasi dengan advokat?', content: 'Cukup cari advokat yang sesuai, pilih tanggal dan jam yang tersedia, dan lakukan pembayaran. Anda akan menerima link video call / konfirmasi sesi.' },
    { id: '4', category: 'BOOKING', title: 'Apa yang terjadi jika advokat membatalkan janji temu?', content: 'Jika advokat membatalkan sesi, Anda akan menerima pengembalian dana penuh 100% atau opsi reskedul jadwal gratis.' },
    { id: '5', category: 'PAYMENT', title: 'Metode pembayaran apa saja yang diterima?', content: 'Kami menerima Virtual Account (BCA, Mandiri, BNI, BRI), QRIS, Kartu Kredit/Debit, dan E-Wallet resmi via sistem escrow terproteksi.' },
    { id: '6', category: 'PRIVACY', title: 'Apakah percakapan dengan advokat saya bersifat rahasia?', content: 'Tentu saja. Seluruh komunikasi dilindungi oleh asas Attorney-Client Privilege dan dienkripsi SSL/TLS 256-bit.' },
    { id: '7', category: 'VERIFICATION', title: 'Bagaimana cara LegalConnect memverifikasi advokat?', content: 'Setiap calon advokat melewati verifikasi 3 tahap: validasi nomor KTPA PERADI, cek Berita Acara Sumpah (BAS) Pengadilan Tinggi, dan background check integritas.' }
  ];

  public readonly accordionItems = computed<AccordionItem[]>(() => {
    let result = this.allFaqs;
    const cat = this.activeCategory();
    const q = this.searchQuery().toLowerCase().trim();

    if (cat !== 'ALL') {
      result = result.filter(f => f.category === cat);
    }
    if (q) {
      result = result.filter(f => f.title.toLowerCase().includes(q) || f.content.toLowerCase().includes(q));
    }

    return result.map((f, index) => ({
      id: f.id,
      title: f.title,
      content: f.content,
      isOpen: index === 0
    }));
  });

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'FAQ - Pertanyaan yang Sering Diajukan',
      description: 'Temukan jawaban atas pertanyaan umum tentang LegalConnect: cara pemesanan, pembayaran, kerahasiaan konsultasi, dan verifikasi advokat.',
      keywords: ['faq legalconnect', 'pertanyaan hukum', 'cara konsultasi advokat']
    });
  }
}
