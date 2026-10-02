import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, ButtonComponent],
  template: `
    <div class="min-h-screen bg-slate-50 pt-24">
      <div class="max-w-3xl mx-auto px-4 py-12">
        
        <!-- Header -->
        <div class="text-center mb-10">
          <h1 class="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Jadwalkan Konsultasi
          </h1>
          <p class="text-slate-500 text-base">Ikuti langkah-langkah berikut untuk memesan sesi konsultasi hukum Anda.</p>
        </div>

        <!-- Progress Steps -->
        <div class="flex items-center justify-between mb-10 px-4">
          @for (step of steps; track step.index; let i = $index) {
            <div class="flex items-center" [class.flex-1]="i < steps.length - 1">
              <div class="flex flex-col items-center">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all"
                  [class.bg-brand-600]="currentStep >= step.index"
                  [class.text-white]="currentStep >= step.index"
                  [class.border-brand-600]="currentStep >= step.index"
                  [class.bg-white]="currentStep < step.index"
                  [class.text-slate-400]="currentStep < step.index"
                  [class.border-slate-300]="currentStep < step.index">
                  @if (currentStep > step.index) {
                    <app-icon name="check" size="sm"></app-icon>
                  } @else {
                    {{ step.index }}
                  }
                </div>
                <span class="text-xs mt-1.5 font-medium hidden sm:block"
                  [class.text-brand-700]="currentStep >= step.index"
                  [class.text-slate-400]="currentStep < step.index">
                  {{ step.label }}
                </span>
              </div>
              @if (i < steps.length - 1) {
                <div class="flex-1 h-0.5 mx-3 mt-0 sm:-mt-4"
                  [class.bg-brand-500]="currentStep > step.index"
                  [class.bg-slate-200]="currentStep <= step.index">
                </div>
              }
            </div>
          }
        </div>

        <!-- Step Content Panel -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          @switch (currentStep) {
            @case (1) {
              <div>
                <h2 class="font-heading font-bold text-slate-900 text-xl mb-6">Pilih Jenis Layanan</h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  @for (type of consultationTypes; track type.value) {
                    <button
                      type="button"
                      class="p-5 rounded-2xl border-2 text-left transition-all hover:-translate-y-0.5"
                      [class.border-brand-500]="selectedType === type.value"
                      [class.bg-brand-50]="selectedType === type.value"
                      [class.border-slate-200]="selectedType !== type.value"
                      (click)="selectedType = type.value">
                      <app-icon [name]="type.icon" size="lg" className="text-brand-600 mb-3"></app-icon>
                      <p class="font-semibold text-slate-800 text-sm">{{ type.label }}</p>
                      <p class="text-xs text-slate-500 mt-1">{{ type.description }}</p>
                    </button>
                  }
                </div>
              </div>
            }
            @case (2) {
              <div>
                <h2 class="font-heading font-bold text-slate-900 text-xl mb-6">Pilih Advokat</h2>
                <p class="text-slate-500 text-sm mb-6">Atau temukan advokat langsung dari <a routerLink="/professionals" class="text-brand-600 hover:underline">direktori advokat</a>.</p>
                <div class="text-center py-16 text-slate-400">
                  <app-icon name="user" size="xl" className="mx-auto mb-4 opacity-30"></app-icon>
                  <p class="font-medium">Pilih advokat dari direktori</p>
                  <app-button routerLink="/professionals" variant="primary" size="md" className="mt-4">Buka Direktori Advokat</app-button>
                </div>
              </div>
            }
            @case (3) {
              <div>
                <h2 class="font-heading font-bold text-slate-900 text-xl mb-6">Pilih Tanggal & Waktu</h2>
                <div class="text-center py-16 text-slate-400">
                  <app-icon name="calendar" size="xl" className="mx-auto mb-4 opacity-30"></app-icon>
                  <p class="font-medium">Kalender jadwal akan tampil setelah memilih advokat.</p>
                </div>
              </div>
            }
            @case (4) {
              <div>
                <h2 class="font-heading font-bold text-slate-900 text-xl mb-6">Konfirmasi & Pembayaran</h2>
                <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-6">
                  <p class="text-sm text-slate-600">Rincian pemesanan akan tampil di sini setelah langkah sebelumnya diselesaikan.</p>
                </div>
              </div>
            }
          }
        </div>

        <!-- Navigation Buttons -->
        <div class="flex items-center justify-between mt-6">
          <app-button
            variant="ghost"
            [disabled]="currentStep <= 1"
            (btnClick)="prevStep()">
            ← Sebelumnya
          </app-button>
          <app-button
            variant="primary"
            size="md"
            (btnClick)="nextStep()">
            {{ currentStep < steps.length ? 'Lanjutkan →' : 'Konfirmasi Pesanan' }}
          </app-button>
        </div>
      </div>
    </div>
  `
})
export class BookingPageComponent implements OnInit {
  private readonly seo = inject(SeoService);
  public currentStep = 1;
  public selectedType = 'ONLINE_VIDEO';

  public readonly steps = [
    { index: 1, label: 'Layanan' },
    { index: 2, label: 'Advokat' },
    { index: 3, label: 'Jadwal' },
    { index: 4, label: 'Konfirmasi' }
  ];

  public readonly consultationTypes = [
    { value: 'ONLINE_VIDEO', icon: 'video', label: 'Video Call Online', description: 'Konsultasi via video call yang aman dan terenkripsi' },
    { value: 'IN_PERSON', icon: 'user', label: 'Tatap Muka', description: 'Kunjungi langsung kantor advokat pilihan Anda' },
    { value: 'DOCUMENT_REVIEW', icon: 'file-text', label: 'Review Dokumen', description: 'Upload dokumen untuk dianalisis oleh advokat' }
  ];

  public nextStep(): void {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
    }
  }

  public prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Jadwalkan Konsultasi Hukum Online',
      description: 'Pesan sesi konsultasi hukum secara online bersama advokat berlisensi PERADI pilihan Anda. Pilih layanan, jadwal, dan metode konsultasi dengan mudah.',
      keywords: ['booking konsultasi hukum', 'jadwal advokat online', 'pesan konsultasi']
    });
  }
}
