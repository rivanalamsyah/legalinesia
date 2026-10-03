import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { LegalProfessionalProfile } from '../../../core/models/user.model';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/ui/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-pro-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PortalPageHeaderComponent,
    StatusBadgeComponent,
    ButtonComponent,
    IconComponent
  ],
  template: `
    <div class="space-y-8 max-w-4xl">
      <!-- Page Header -->
      <app-portal-page-header
        categoryLabel="Legal Professional Portal"
        title="Profil & Verifikasi Advokat"
        subtitle="Kelola lisensi keorganisasian advokat, spesialisasi hukum, serta informasi publik profil Anda."
        [breadcrumbs]="[{ label: 'Portal Advokat', url: '/portal/pro' }, { label: 'Profil & Verifikasi' }]">
        
        <app-status-badge status="VERIFIED" label="VERIFIED ADVOKAT"></app-status-badge>
      </app-portal-page-header>

      @if (saveSuccess()) {
        <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <app-icon name="check-circle" size="sm"></app-icon>
          <span>Profil & Verifikasi Advokat berhasil diperbarui!</span>
        </div>
      }

      <form [formGroup]="profileForm" (ngSubmit)="onSave()" class="space-y-6">
        
        <!-- Bar Verification Status Card -->
        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
          <div class="flex items-center justify-between border-b border-navy-800 pb-3">
            <h3 class="text-base font-semibold text-white font-heading flex items-center gap-2">
              <app-icon name="shield-check" size="sm" class="text-brand-400"></app-icon>
              <span>Verifikasi Keanggotaan Advokat</span>
            </h3>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Terverifikasi Aktif
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block text-white/60 mb-1">Organisasi Advokat</label>
              <input type="text" formControlName="barAssociation" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white" />
            </div>

            <div>
              <label class="block text-white/60 mb-1">Nomor Induk Advokat (NIA)</label>
              <input type="text" formControlName="barLicenseNumber" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white font-mono" />
            </div>
          </div>
        </div>

        <!-- Personal & Professional Information -->
        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
          <h3 class="text-base font-semibold text-white font-heading">Informasi Diri & Bio Publik</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block text-white/60 mb-1">Nama Lengkap & Gelar</label>
              <input type="text" formControlName="fullName" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white" />
            </div>

            <div>
              <label class="block text-white/60 mb-1">Alamat Email Kontak</label>
              <input type="email" formControlName="email" readonly class="w-full bg-navy-900 border border-navy-800 rounded-xl p-2.5 text-white/50 cursor-not-allowed font-mono" />
            </div>

            <div>
              <label class="block text-white/60 mb-1">Pengalaman Praktik (Tahun)</label>
              <input type="number" formControlName="yearsOfExperience" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white" />
            </div>

            <div>
              <label class="block text-white/60 mb-1">Tarif Konsultasi Standar (Rp / Sesi)</label>
              <input type="number" formControlName="consultationFee" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white font-mono" />
            </div>

            <div class="md:col-span-2">
              <label class="block text-white/60 mb-1">Spesialisasi / Area Praktik Utama</label>
              <input type="text" formControlName="specializations" placeholder="Misal: Hukum Bisnis & Korporasi, HKI, Hukum Kontrak" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white" />
            </div>

            <div class="md:col-span-2">
              <label class="block text-white/60 mb-1">Ringkasan Biografi Profesional</label>
              <textarea formControlName="bio" rows="4" placeholder="Pengalaman penanganan perkara dan keahlian spesifik..." class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white leading-relaxed"></textarea>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <app-button type="submit" variant="primary" size="md" iconLeft="save">
            Simpan Perubahan Profil
          </app-button>
        </div>

      </form>
    </div>
  `
})
export class ProProfileComponent {
  private readonly authState = inject(AuthStateService);
  private readonly fb = inject(FormBuilder);

  public saveSuccess = signal<boolean>(false);

  public get user(): LegalProfessionalProfile | null {
    return this.authState.currentUser() as LegalProfessionalProfile | null;
  }

  public profileForm = this.fb.group({
    fullName: [this.user?.fullName || 'Bambang Sutrisno, S.H., M.H.', Validators.required],
    email: [this.user?.email || 'bambang.sutrisno@legalinesia.id'],
    barAssociation: ['PERADI (Perhimpunan Advokat Indonesia)', Validators.required],
    barLicenseNumber: [this.user?.barLicenseNumber || 'PERADI/2012/84729', Validators.required],
    yearsOfExperience: [14, Validators.required],
    consultationFee: [this.user?.consultationFee || 350000, Validators.required],
    specializations: ['Hukum Bisnis & Korporasi, HKI, Hukum Kontrak & Perjanjian'],
    bio: [
      'Advokat senior dengan pengalaman lebih dari 14 tahun dalam penanganan hukum bisnis, pendirian badan usaha PT/CV, lisensi HKI DJKI Kemenkumham, serta review draft kontrak kerjasama strategis.'
    ]
  });

  public onSave(): void {
    if (this.profileForm.invalid) return;
    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 4000);
  }
}
