import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { ContainerComponent } from '../../../shared/components/ui/container/container.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, IconComponent, ContainerComponent],
  template: `
    <!-- Hero -->
    <section class="relative pt-28 pb-20 bg-gradient-to-br from-navy-800 via-brand-900 to-brand-800 text-white overflow-hidden">
      <div class="absolute inset-0 opacity-5" style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;)"></div>
      <app-container size="lg" className="relative z-10">
        <div class="max-w-3xl">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-gold-400 mb-3">Tentang Kami</p>
          <h1 class="font-heading text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Misi Kami: Keadilan Hukum<br>
            <span class="text-gradient-gold">yang Dapat Diakses Semua</span>
          </h1>
          <p class="text-slate-300 text-lg leading-relaxed">
            LegalConnect didirikan atas keyakinan bahwa setiap warga negara Indonesia berhak mendapatkan akses ke layanan hukum berkualitas — tanpa terhalang oleh birokrasi, informasi yang tidak simetris, atau biaya yang tidak terjangkau.
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

    <!-- CTA -->
    <section class="py-20 bg-slate-50">
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

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Tentang LegalConnect',
      description: 'Pelajari misi, visi, dan nilai-nilai LegalConnect sebagai platform legal-tech terpercaya yang menghubungkan masyarakat Indonesia dengan advokat berlisensi PERADI.',
      keywords: ['tentang legalconnect', 'platform hukum indonesia', 'legal tech startup']
    });
  }
}
