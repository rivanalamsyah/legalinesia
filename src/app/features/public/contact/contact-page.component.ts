import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SeoService } from '../../../core/services/seo.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  ContainerComponent, BreadcrumbComponent, ButtonComponent,
  InputComponent, SelectComponent, TextareaComponent, IconComponent
} from '../../../shared/components/ui';
import { PUBLIC_NAVIGATION_CONFIG } from '../../../core/config/navigation.config';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ContainerComponent,
    BreadcrumbComponent, ButtonComponent, InputComponent,
    SelectComponent, TextareaComponent, IconComponent
  ],
  template: `
    <!-- Hero Header -->
    <section class="pt-28 pb-16 bg-gradient-to-br from-brand-900 via-navy-800 to-brand-900 text-white">
      <app-container size="lg">
        <app-breadcrumb [items]="[{ label: 'Hubungi Kami' }]"></app-breadcrumb>

        <div class="max-w-3xl mt-4">
          <h1 class="font-heading text-4xl md:text-5xl font-bold mb-4">
            Hubungi <span class="text-gradient-gold">Tim Support Kami</span>
          </h1>
          <p class="text-slate-300 text-base md:text-lg leading-relaxed">
            Punya pertanyaan seputar layanan, pemesanan, atau butuh bantuan darurat? Kami siap membantu 24/7.
          </p>
        </div>
      </app-container>
    </section>

    <!-- Contact Form & Info Grid -->
    <section class="section-padding bg-slate-50">
      <app-container size="lg">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <!-- Contact Info Sidebar -->
          <aside class="lg:col-span-4 space-y-8">
            <div class="surface-card p-6 md:p-8">
              <h2 class="font-heading font-bold text-slate-900 text-xl mb-6">Informasi Kontak</h2>
              
              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                    <app-icon name="phone" size="md"></app-icon>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Telepon</p>
                    <a [href]="'tel:' + navConfig.contactInfo.phone" class="text-sm font-semibold text-slate-800 hover:text-brand-600 transition-colors">
                      {{ navConfig.contactInfo.phone }}
                    </a>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                    <app-icon name="mail" size="md"></app-icon>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email Support</p>
                    <a [href]="'mailto:' + navConfig.contactInfo.email" class="text-sm font-semibold text-slate-800 hover:text-brand-600 transition-colors">
                      {{ navConfig.contactInfo.email }}
                    </a>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                    <app-icon name="map-pin" size="md"></app-icon>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Alamat Kantor</p>
                    <p class="text-xs md:text-sm text-slate-700 leading-relaxed">
                      {{ navConfig.contactInfo.address }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- WhatsApp Direct Card -->
            <div class="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-6 shadow-xl">
              <h3 class="font-heading font-bold text-lg mb-2">Konsultasi Darurat WhatsApp</h3>
              <p class="text-emerald-100 text-xs leading-relaxed mb-4">
                Tim customer service kami terhubung langsung via WhatsApp untuk pertanyaan cepat.
              </p>
              <a
                [href]="navConfig.contactInfo.whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors">
                Chat Support WhatsApp
                <app-icon name="arrow-right" size="xs"></app-icon>
              </a>
            </div>
          </aside>

          <!-- Contact Reactive Form -->
          <div class="lg:col-span-8">
            <div class="surface-card p-6 md:p-10">
              <h2 class="font-heading font-bold text-2xl text-slate-900 mb-2">Kirim Pesan</h2>
              <p class="text-slate-500 text-sm mb-8">Isi formulir di bawah ini. Tim kami akan merespons dalam 1x24 jam kerja.</p>

              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <app-input
                    label="Nama Lengkap"
                    placeholder="Sesuai KTP"
                    formControlName="fullName"
                    [required]="true"
                    [errorMessage]="getFieldError('fullName')">
                  </app-input>

                  <app-input
                    label="Email"
                    type="email"
                    placeholder="nama@email.com"
                    formControlName="email"
                    [required]="true"
                    [errorMessage]="getFieldError('email')">
                  </app-input>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <app-input
                    label="Nomor WhatsApp / Telepon"
                    type="tel"
                    placeholder="08123456789"
                    formControlName="phone"
                    [required]="true"
                    [errorMessage]="getFieldError('phone')">
                  </app-input>

                  <app-select
                    label="Topik Pertanyaan"
                    placeholder="Pilih topik..."
                    [options]="topicOptions"
                    formControlName="topic"
                    [required]="true"
                    [errorMessage]="getFieldError('topic')">
                  </app-select>
                </div>

                <app-textarea
                  label="Pesan Anda"
                  placeholder="Jelaskan secara singkat kebutuhan atau pertanyaan hukum Anda..."
                  [rows]="5"
                  [maxLength]="1000"
                  formControlName="message"
                  [required]="true"
                  [errorMessage]="getFieldError('message')">
                </app-textarea>

                <div class="pt-2">
                  <app-button
                    type="submit"
                    variant="primary"
                    size="lg"
                    [loading]="isSubmitting"
                    [fullWidth]="true">
                    Kirim Pesan Support
                  </app-button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </app-container>
    </section>
  `
})
export class ContactPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly seo = inject(SeoService);
  private readonly notifier = inject(NotificationService);

  public readonly navConfig = PUBLIC_NAVIGATION_CONFIG;
  public isSubmitting = false;

  public readonly topicOptions = [
    { label: 'Bantuan Pemesanan / Konsultasi', value: 'booking' },
    { label: 'Pertanyaan Pembayaran & Escrow', value: 'payment' },
    { label: 'Pendaftaran Advokat Baru', value: 'lawyer_registration' },
    { label: 'Keluhan & Pengaduan Sesi', value: 'complaint' },
    { label: 'Lainnya', value: 'other' }
  ];

  public contactForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(9)]],
    topic: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(15)]]
  });

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Hubungi Kami - Tim Support LegalConnect',
      description: 'Hubungi tim support LegalConnect untuk bantuan pemesanan konsultasi, pembayaran, atau kendala platform.'
    });
  }

  public getFieldError(field: string): string | undefined {
    const ctrl = this.contactForm.get(field);
    if (ctrl && ctrl.touched && ctrl.invalid) {
      if (ctrl.errors?.['required']) return 'Wajib diisi';
      if (ctrl.errors?.['email']) return 'Format email tidak valid';
      if (ctrl.errors?.['minlength']) return `Minimal ${ctrl.errors['minlength'].requiredLength} karakter`;
    }
    return undefined;
  }

  public onSubmit(): void {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) return;

    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
      this.notifier.success('Pesan Terkirim', 'Pesan Anda berhasil terkirim! Tim kami akan membalas via email/WhatsApp.');
      this.contactForm.reset();
    }, 1200);
  }
}
