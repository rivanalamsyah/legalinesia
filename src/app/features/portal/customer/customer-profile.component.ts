import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CustomerProfile } from '../../../core/models/user.model';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ToastComponent } from '../../../shared/components/ui/toast/toast.component';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PortalPageHeaderComponent,
    ButtonComponent,
    ToastComponent
  ],
  template: `
    <div class="space-y-6 max-w-3xl">
      
      <!-- Page Header -->
      <app-portal-page-header
        categoryLabel="Portal Klien"
        title="Pengaturan Profil Klien"
        subtitle="Kelola data identitas akun, informasi kontak WhatsApp, serta tipe entitas klien Anda."
        [breadcrumbs]="[{ label: 'Portal Klien', url: '/portal/customer' }, { label: 'Pengaturan Profil' }]">
      </app-portal-page-header>

      <!-- Profile Form -->
      <form [formGroup]="profileForm" (ngSubmit)="onSaveProfile()" class="glass-panel p-6 sm:p-8 rounded-2xl border border-navy-800 space-y-5 shadow-sm">
        
        <!-- Customer Type Selection -->
        <div>
          <label class="block text-xs font-semibold text-white/70 uppercase tracking-wide mb-2">Tipe Klien / Akun</label>
          <div class="grid grid-cols-2 gap-3">
            <label
              class="flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all"
              [ngClass]="profileForm.get('customerType')?.value === 'INDIVIDUAL' ? 'border-brand-400 bg-brand-900/50 text-white font-semibold' : 'border-white/10 text-white/60'">
              <input type="radio" formControlName="customerType" value="INDIVIDUAL" class="text-brand-500" />
              <span class="text-xs">Perorangan (Individual)</span>
            </label>

            <label
              class="flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all"
              [ngClass]="profileForm.get('customerType')?.value === 'BUSINESS' ? 'border-brand-400 bg-brand-900/50 text-white font-semibold' : 'border-white/10 text-white/60'">
              <input type="radio" formControlName="customerType" value="BUSINESS" class="text-brand-500" />
              <span class="text-xs">Perusahaan / Badan Usaha</span>
            </label>
          </div>
        </div>

        <!-- Full Name -->
        <div>
          <label for="cust-fullname" class="block text-xs font-semibold text-white/70 uppercase tracking-wide mb-1.5">Nama Lengkap (Sesuai KTP)</label>
          <input
            id="cust-fullname"
            type="text"
            formControlName="fullName"
            class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-400"
            placeholder="Masukkan nama lengkap Anda" />
          @if (profileForm.get('fullName')?.touched && profileForm.get('fullName')?.invalid) {
            <span class="text-[11px] text-rose-400 mt-1 block">Nama lengkap minimal 3 karakter.</span>
          }
        </div>

        <!-- Company Name (If Business) -->
        @if (profileForm.get('customerType')?.value === 'BUSINESS') {
          <div>
            <label for="cust-company" class="block text-xs font-semibold text-white/70 uppercase tracking-wide mb-1.5">Nama Perusahaan / PT / CV</label>
            <input
              id="cust-company"
              type="text"
              formControlName="companyName"
              class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-400"
              placeholder="e.g. PT Nusantara Digital Karya" />
          </div>
        }

        <!-- Email (Read-Only) -->
        <div>
          <div class="flex justify-between items-center mb-1.5">
            <label for="cust-email" class="block text-xs font-semibold text-white/70 uppercase tracking-wide">Email Akun (Utama)</label>
            <span class="text-[10px] text-white/40">Field Terkunci (Read-Only)</span>
          </div>
          <input
            id="cust-email"
            type="email"
            formControlName="email"
            class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 text-xs cursor-not-allowed select-none"
            readonly />
        </div>

        <!-- Phone / WhatsApp -->
        <div>
          <label for="cust-phone" class="block text-xs font-semibold text-white/70 uppercase tracking-wide mb-1.5">Nomor Telepon / WhatsApp Active</label>
          <input
            id="cust-phone"
            type="text"
            formControlName="phoneNumber"
            class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-400"
            placeholder="e.g. +6281234567890" />
          @if (profileForm.get('phoneNumber')?.touched && profileForm.get('phoneNumber')?.invalid) {
            <span class="text-[11px] text-rose-400 mt-1 block">Nomor telepon minimal 9 digit angka.</span>
          }
        </div>

        <!-- City -->
        <div>
          <label for="cust-city" class="block text-xs font-semibold text-white/70 uppercase tracking-wide mb-1.5">Kota / Lokasi Domisili</label>
          <input
            id="cust-city"
            type="text"
            formControlName="city"
            class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-400"
            placeholder="e.g. Jakarta Selatan" />
        </div>

        <!-- Submit Button -->
        <div class="pt-2 flex items-center justify-end">
          <app-button
            type="submit"
            variant="primary"
            size="md"
            iconLeft="save"
            [loading]="isSubmitting">
            Simpan Perubahan Profil
          </app-button>
        </div>

      </form>

      <!-- Toast Container -->
      <app-toast></app-toast>

    </div>
  `
})
export class CustomerProfileComponent {
  private readonly authState = inject(AuthStateService);
  private readonly notify = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  public user = this.authState.currentUser() as CustomerProfile | null;
  public isSubmitting = false;

  public profileForm = this.fb.group({
    customerType: [this.user?.customerType || 'INDIVIDUAL', Validators.required],
    fullName: [this.user?.fullName || '', [Validators.required, Validators.minLength(3)]],
    companyName: [this.user?.companyName || ''],
    email: [this.user?.email || ''],
    phoneNumber: [this.user?.phoneNumber || '', [Validators.required, Validators.minLength(9)]],
    city: [this.user?.city || 'Jakarta Selatan']
  });

  public onSaveProfile(): void {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.invalid) return;

    this.isSubmitting = true;
    setTimeout(() => {
      const updatedUser: CustomerProfile = {
        ...this.user!,
        customerType: this.profileForm.value.customerType as any,
        fullName: this.profileForm.value.fullName || '',
        companyName: this.profileForm.value.companyName || '',
        phoneNumber: this.profileForm.value.phoneNumber || '',
        city: this.profileForm.value.city || '',
        updatedAt: new Date().toISOString()
      };
      this.authState.setUser(updatedUser);
      this.isSubmitting = false;
      this.notify.success('Profil Diperbarui', 'Data profil Klien Anda berhasil disimpan.');
    }, 600);
  }
}
