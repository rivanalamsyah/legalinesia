import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { UserProfile } from '../../../core/models/user.model';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <div class="space-y-6 max-w-2xl">
      <div>
        <h2 class="text-xl font-bold text-white">Pengaturan Profil Klien</h2>
        <p class="text-xs text-white/60">Perbarui identitas, kontak, dan informasi akun Anda.</p>
      </div>

      <form [formGroup]="profileForm" (ngSubmit)="onSave()" class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
        <div>
          <label class="block text-xs font-semibold text-white/70 uppercase mb-1">Nama Lengkap</label>
          <input type="text" formControlName="fullName" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-white/70 uppercase mb-1">Email</label>
          <input type="email" formControlName="email" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm cursor-not-allowed" readonly />
        </div>
        <div>
          <label class="block text-xs font-semibold text-white/70 uppercase mb-1">Nomor Telepon / WA</label>
          <input type="text" formControlName="phoneNumber" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
        </div>
        <div class="pt-2">
          <app-button type="submit" variant="primary" size="md">Simpan Perubahan</app-button>
        </div>
      </form>
    </div>
  `
})
export class CustomerProfileComponent {
  private readonly authState = inject(AuthStateService);
  private readonly fb = inject(FormBuilder);

  public user: UserProfile | null = this.authState.currentUser();

  public profileForm = this.fb.group({
    fullName: [this.user?.fullName || '', Validators.required],
    email: [this.user?.email || ''],
    phoneNumber: [this.user?.phoneNumber || '']
  });

  public onSave(): void {
    if (this.profileForm.invalid) return;
  }
}
