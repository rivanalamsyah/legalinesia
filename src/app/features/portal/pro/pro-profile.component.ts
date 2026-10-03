import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { LegalProfessionalProfile } from '../../../core/models/user.model';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-pro-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <div class="space-y-6 max-w-2xl">
      <div>
        <h2 class="text-xl font-bold text-white">Profil & Verifikasi Advokat</h2>
        <p class="text-xs text-white/60">Kelola informasi lisensi PERADI, riwayat pendidikan, dan bio profesional.</p>
      </div>

      <form [formGroup]="profileForm" (ngSubmit)="onSave()" class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
        <div>
          <label class="block text-xs font-semibold text-white/70 uppercase mb-1">Nama Gelar Lengkap</label>
          <input type="text" formControlName="fullName" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-white/70 uppercase mb-1">Nomor Lisensi Advokat (NIA)</label>
          <input type="text" formControlName="barLicenseNumber" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-white/70 uppercase mb-1">Tarif Konsultasi per Jam (Rp)</label>
          <input type="number" formControlName="consultationFee" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
        </div>
        <div class="pt-2">
          <app-button type="submit" variant="primary" size="md">Simpan Perubahan</app-button>
        </div>
      </form>
    </div>
  `
})
export class ProProfileComponent {
  private readonly authState = inject(AuthStateService);
  private readonly fb = inject(FormBuilder);

  public get user(): LegalProfessionalProfile | null {
    return this.authState.currentUser() as LegalProfessionalProfile | null;
  }

  public profileForm = this.fb.group({
    fullName: [this.user?.fullName || '', Validators.required],
    barLicenseNumber: [this.user?.barLicenseNumber || '', Validators.required],
    consultationFee: [this.user?.consultationFee || 350000, Validators.required]
  });

  public onSave(): void {
    if (this.profileForm.invalid) return;
  }
}
