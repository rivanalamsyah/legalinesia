import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { ContainerComponent } from '../../../shared/components/ui/container/container.component';
import { SearchFieldComponent } from '../../../shared/components/ui/search-field/search-field.component';
import { AccordionComponent, AccordionItem } from '../../../shared/components/ui/accordion/accordion.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ButtonComponent, IconComponent,
    ContainerComponent, SearchFieldComponent, AccordionComponent
  ],
  template: `
    <!-- Hero Header -->
    <section class="relative pt-28 pb-20 bg-gradient-to-br from-navy-800 via-brand-900 to-brand-800 text-white overflow-hidden">
      <div class="absolute inset-0 opacity-5" style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;)"></div>
      <app-container size="lg" className="relative z-10">
        <div class="max-w-3xl">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-gold-400 mb-3">Tentang Kami & Pusat Bantuan</p>
          <h1 class="font-heading text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Misi Kami: Keadilan Hukum<br>
            <span class="text-gradient-gold">yang Dapat Diakses Semua</span>
          </h1>
          <p class="text-slate-300 text-lg leading-relaxed">
            Legalinesia didirikan atas keyakinan bahwa setiap warga negara Indonesia berhak mendapatkan akses ke layanan hukum berkualitas — tanpa terhalang oleh birokrasi, informasi yang tidak simetris, atau biaya yang tidak terjangkau.
          </p>
        </div>
      </app-container>
    </section>

    <!-- Mission & Vision -->
    <section class="py-20 bg-white">
      <app-container size="lg">
        <div class="grid md:grid-cols-2 gap-10 mb-20">
          <div class="bg-brand-50 rounded-3xl p-8 border border-brand-100">
            <div class="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center mb-5">
              <app-icon name="scale" size="lg" className="text-white"></app-icon>
            </div>
            <h2 class="font-heading text-2xl font-bold text-slate-900 mb-4">Visi Kami</h2>
            <p class="text-slate-600 leading-relaxed">Menjadi platform legal-tech terdepan di Asia Tenggara yang menghapus kesenjangan akses keadilan antara masyarakat umum dengan sistem hukum yang kompleks.</p>
          </div>
          <div class="bg-gold-50 rounded-3xl p-8 border border-gold-100">
            <div class="w-12 h-12 rounded-xl bg-gold-500 flex items-center justify-center mb-5">
              <app-icon name="shield-check" size="lg" className="text-white"></app-icon>
            </div>
            <h2 class="font-heading text-2xl font-bold text-slate-900 mb-4">Misi Kami</h2>
            <p class="text-slate-600 leading-relaxed">Menghubungkan setiap masyarakat Indonesia dengan advokat profesional berlisensi melalui teknologi yang aman, transparan, dan dapat dipercaya.</p>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-y border-slate-200">
          @for (stat of stats; track stat.label) {
            <div class="text-center">
              <p class="font-heading text-4xl md:text-5xl font-bold text-brand-700 mb-2">{{ stat.value }}</p>
              <p class="text-sm text-slate-500">{{ stat.label }}</p>
            </div>
          }
        </div>

        <!-- Values -->
        <div class="mt-20">
          <h2 class="font-heading text-3xl font-bold text-slate-900 mb-10 text-center">Nilai-Nilai yang Kami Pegang</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            @for (value of coreValues; track value.title) {
              <div class="text-center">
                <div class="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                  <app-icon [name]="value.icon" size="lg" className="text-brand-600"></app-icon>
                </div>
                <h3 class="font-heading font-bold text-slate-900 text-lg mb-2">{{ value.title }}</h3>
                <p class="text-sm text-slate-500 leading-relaxed">{{ value.description }}</p>
              </div>
            }
          </div>
        </div>
      </app-container>
    </section>

    <!-- FAQ & Pusat Bantuan Section (Embedded) -->
    <section id="faq" class="py-20 bg-slate-50 border-t border-slate-200">
      <app-container size="md">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100 inline-block mb-3">
            Pusat Bantuan & FAQ
          </span>
          <h2 class="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p class="text-slate-600 text-base leading-relaxed mb-8">
            Temukan jawaban cepat seputar cara pemesanan, metode pembayaran Virtual Account, kerahasiaan dokumen, dan verifikasi lisensi advokat.
          </p>

          <!-- Search Input -->
          <div class="max-w-xl mx-auto mb-8">
            <app-search-field
              placeholder="Cari pertanyaan atau kata kunci..."
              (search)="searchQuery.set($event)">
            </app-search-field>
          </div>

          <!-- Category Chips -->
          <div class="flex flex-wrap justify-center gap-2 mb-8">
            <button
              *ngFor="let cat of faqCategories"
              type="button"
              class="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200"
              [ngClass]="activeCategory() === cat.key ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'"
              (click)="activeCategory.set(cat.key)">
              {{ cat.label }}
            </button>
          </div>
        </div>

        <!-- FAQ Accordion -->
        <app-accordion [items]="accordionItems()" [allowMultiple]="false"></app-accordion>
      </app-container>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-white border-t border-slate-200">
      <app-container size="md" className="text-center">
        <h2 class="font-heading text-3xl font-bold text-slate-900 mb-5">Bergabung dalam Misi Kami</h2>
        <p class="text-slate-600 mb-8">Baik sebagai klien yang membutuhkan solusi hukum, advokat yang ingin memperluas jangkauan, atau mitra strategis kami.</p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <app-button routerLink="/auth/register" variant="primary" size="lg">Daftar sebagai Klien</app-button>
          <app-button routerLink="/contact" variant="outline" size="lg">Daftar sebagai Advokat</app-button>
        </div>
      </app-container>
    </section>
  `
})
export class AboutPageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  public readonly activeCategory = signal<string>('ALL');
  public readonly searchQuery = signal<string>('');

  public readonly stats = [
    { value: '2024', label: 'Tahun Pendirian' },
    { value: '2,400+', label: 'Advokat Terverifikasi' },
    { value: '48', label: 'Kota Terjangkau' },
    { value: '18K+', label: 'Kasus Diselesaikan' }
  ];

  public readonly coreValues = [
    { icon: 'shield-check', title: 'Kepercayaan & Integritas', description: 'Setiap keputusan yang kami buat didorong oleh komitmen kami terhadap transparansi dan integritas hukum.' },
    { icon: 'user', title: 'Klien di Pusat Segalanya', description: 'Platform kami dirancang dari sudut pandang klien — mudah, aman, dan memberikan rasa tenang.' },
    { icon: 'scale', title: 'Keadilan yang Inklusif', description: 'Kami percaya akses ke layanan hukum berkualitas adalah hak, bukan privilege. Kami berkomitmen untuk mewujudkannya.' }
  ];

  public readonly faqCategories = [
    { key: 'ALL', label: 'Semua Pertanyaan' },
    { key: 'GENERAL', label: 'Umum & Layanan' },
    { key: 'BOOKING', label: 'Pemesanan & Jadwal' },
    { key: 'PAYMENT', label: 'Pembayaran' },
    { key: 'PRIVACY', label: 'Privasi & Keamanan' },
    { key: 'VERIFICATION', label: 'Verifikasi Advokat' }
  ];

  private readonly allFaqs = [
    { id: '1', category: 'GENERAL', title: 'Apa itu Legalinesia dan bagaimana cara kerjanya?', content: 'Legalinesia adalah platform digital yang menghubungkan masyarakat Indonesia dengan advokat berlisensi PERADI secara transparan, mudah, dan aman.' },
    { id: '2', category: 'GENERAL', title: 'Apakah Legalinesia terdaftar dan legal di Indonesia?', content: 'Ya. Legalinesia beroperasi sesuai regulasi hukum Indonesia dan seluruh advokat di platform kami memiliki lisensi resmi aktif PERADI.' },
    { id: '3', category: 'BOOKING', title: 'Bagaimana cara memesan konsultasi dengan advokat?', content: 'Cukup cari advokat yang sesuai, pilih tanggal dan jam yang tersedia, dan lakukan pembayaran. Anda akan menerima link video call / konfirmasi sesi.' },
    { id: '4', category: 'BOOKING', title: 'Apa yang terjadi jika advokat membatalkan janji temu?', content: 'Jika advokat membatalkan sesi, Anda akan menerima pengembalian dana penuh 100% atau opsi reskedul jadwal gratis.' },
    { id: '5', category: 'PAYMENT', title: 'Metode pembayaran apa saja yang diterima?', content: 'Kami menerima Virtual Account (BCA, Mandiri, BNI, BRI) dengan verifikasi otomatis atau manual admin.' },
    { id: '6', category: 'PRIVACY', title: 'Apakah percakapan dengan advokat saya bersifat rahasia?', content: 'Tentu saja. Seluruh komunikasi dilindungi oleh asas Attorney-Client Privilege dan dienkripsi SSL/TLS 256-bit.' },
    { id: '7', category: 'VERIFICATION', title: 'Bagaimana cara Legalinesia memverifikasi advokat?', content: 'Setiap calon advokat melewati verifikasi 3 tahap: validasi nomor KTPA PERADI, cek Berita Acara Sumpah (BAS) Pengadilan Tinggi, dan background check integritas.' }
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
      title: 'Tentang Legalinesia & Pusat Bantuan FAQ',
      description: 'Pelajari misi, visi, nilai-nilai, dan Pusat Bantuan FAQ Legalinesia sebagai platform legal-tech terpercaya di Indonesia.',
      keywords: ['tentang legalinesia', 'faq legalinesia', 'platform hukum indonesia', 'legal tech startup']
    });
  }
}
