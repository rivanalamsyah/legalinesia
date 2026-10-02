import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { ContainerComponent, BreadcrumbComponent, IconComponent } from '../../../shared/components/ui';
import { CTASectionComponent } from '../../../shared/components/layout';

interface Step {
  step: number;
  title: string;
  description: string;
  icon: string;
  detail: string;
}

@Component({
  selector: 'app-how-it-works-page',
  standalone: true,
  imports: [
    CommonModule, ContainerComponent, BreadcrumbComponent,
    IconComponent, CTASectionComponent
  ],
  template: `
    <!-- Hero Header -->
    <section class="pt-28 pb-16 bg-gradient-to-br from-brand-900 via-navy-800 to-brand-900 text-white">
      <app-container size="lg">
        <app-breadcrumb [items]="[{ label: 'Cara Kerja' }]"></app-breadcrumb>

        <div class="max-w-3xl mt-4">
          <h1 class="font-heading text-4xl md:text-5xl font-extrabold mb-5">
            Cara Kerja <span class="text-gradient-gold">LegalConnect</span>
          </h1>
          <p class="text-slate-300 text-base md:text-lg leading-relaxed">
            Proses konsultasi hukum yang transparan, mudah, dan terproteksi — dari pencarian advokat hingga penerimaan rekomendasi hukum tertulis.
          </p>
        </div>
      </app-container>
    </section>

    <!-- Timeline Steps -->
    <section class="section-padding bg-slate-50">
      <app-container size="md">
        <div class="space-y-16">
          <div
            *ngFor="let step of steps"
            class="flex flex-col md:flex-row gap-8 items-center"
            [class.md:flex-row-reverse]="step.step % 2 === 0">
            
            <!-- Step Badge Visual -->
            <div class="flex-shrink-0">
              <div
                class="w-28 h-28 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-xl"
                [ngClass]="step.step % 2 === 0 ? 'bg-gradient-to-br from-brand-600 to-navy-900' : 'bg-gradient-to-br from-gold-500 to-amber-600'">
                <app-icon [name]="step.icon" size="xl" className="text-white"></app-icon>
                <span class="text-[10px] uppercase font-bold tracking-wider text-white/80">Langkah 0{{ step.step }}</span>
              </div>
            </div>

            <!-- Step Content -->
            <div class="flex-1 surface-card p-6 md:p-8">
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold mb-3">
                Langkah {{ step.step }} dari {{ steps.length }}
              </div>
              <h2 class="font-heading font-bold text-xl md:text-2xl text-slate-900 mb-3">{{ step.title }}</h2>
              <p class="text-slate-600 text-sm leading-relaxed mb-4">{{ step.description }}</p>
              
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <app-icon name="info" size="xs" class="text-brand-600 shrink-0 mt-0.5"></app-icon>
                <span><strong>Catatan Detail:</strong> {{ step.detail }}</span>
              </div>
            </div>

          </div>
        </div>
      </app-container>
    </section>

    <!-- CTA Section -->
    <app-cta-section
      title="Siap Mendapatkan Kepastian Hukum?"
      subtitle="Jadwalkan konsultasi bersama advokat spesialis berlisensi hari ini."
      primaryLabel="Cari Advokat Sekarang"
      primaryRoute="/professionals">
    </app-cta-section>
  `
})
export class HowItWorksPageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  public readonly steps: Step[] = [
    { step: 1, icon: 'search', title: 'Cari & Pilih Advokat Spesialis', description: 'Gunakan direktori advokat untuk memilih profesional hukum yang sesuai. Filter berdasarkan spesialisasi, lokasi kota, tarif, dan ulasan terverifikasi.', detail: 'Setiap profil advokat menampilkan nomor lisensi PERADI dan riwayat kasus.' },
    { step: 2, icon: 'calendar', title: 'Pilih Jadwal & Metode Sesi', description: 'Pilih slot tanggal dan jam sesuai waktu luang Anda. Pilih format sesi: Video Call, Chat terenkripsi, atau Pertemuan Tatap Muka.', detail: 'Konfirmasi otomatis terkirim via Email & SMS pengingat.' },
    { step: 3, icon: 'lock', title: 'Pembayaran Rekber (Escrow) Aman', description: 'Bayar via Transfer Bank, Virtual Account, atau E-Wallet. Pembayaran disimpan di escrow terproteksi.', detail: 'Dana baru dicairkan ke advokat setelah sesi konsultasi selesai.' },
    { step: 4, icon: 'video', title: 'Sesi Konsultasi Terproteksi', description: 'Bergabung ke ruang konsultasi online terenkripsi end-to-end dengan jaminan kerahasiaan Attorney-Client Privilege.', detail: 'Enkripsi SSL/TLS 256-bit menjaga keamanan dokumen Anda.' },
    { step: 5, icon: 'file-text', title: 'Terima Catatan & Langkah Hukum', description: 'Advokat memberikan ringkasan konsultasi tertulis beserta rekomendasi langkah hukum konkrit pasca-sesi.', detail: 'Catatan konsultasi dapat diakses kapan saja melalui akun Anda.' }
  ];

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Cara Kerja Platform Konsultasi Hukum',
      description: 'Pelajari cara LegalConnect menghubungkan Anda dengan advokat berlisensi dalam 5 langkah mudah — dari pencarian hingga penyelesaian kasus.',
      keywords: ['cara konsultasi hukum online', 'booking advokat', 'konsultasi online indonesia']
    });
  }
}
