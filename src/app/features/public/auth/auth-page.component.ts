import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, ButtonComponent, IconComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-brand-900 to-navy-800 flex items-center justify-center p-4 pt-24">
      <div class="w-full max-w-md">

        <!-- Logo -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <app-icon name="scale" size="md" className="text-white"></app-icon>
            </div>
            <span class="font-heading font-bold text-2xl text-white">
              Legal<span class="text-brand-400">Connect</span>
            </span>
          </a>
        </div>

        <!-- Card -->
        <div class="glass-panel-dark rounded-3xl p-8 shadow-2xl">
          <!-- Tabs -->
          <div class="flex gap-1 bg-white/5 rounded-xl p-1 mb-8">
            <button
              type="button"
              class="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              [ngClass]="activeTab === 'login' ? 'bg-white text-brand-800' : 'text-white/60'"
              (click)="activeTab = 'login'"
              [attr.aria-selected]="activeTab === 'login'">
              Masuk
            </button>
            <button
              type="button"
              class="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              [ngClass]="activeTab === 'register' ? 'bg-white text-brand-800' : 'text-white/60'"
              (click)="activeTab = 'register'"
              [attr.aria-selected]="activeTab === 'register'">
              Daftar
            </button>
          </div>

          <!-- Login Form -->
          @if (activeTab === 'login') {
            <form [formGroup]="loginForm" (ngSubmit)="onLogin()" novalidate>
              <div class="space-y-5">
                <div>
                  <label for="auth-email" class="block text-xs font-semibold text-white/70 uppercase tracking-wide mb-1.5">Email</label>
                  <input
                    id="auth-email"
                    type="email"
                    formControlName="email"
                    class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                    placeholder="nama@email.com"
                    autocomplete="email" />
                </div>
                <div>
                  <div class="flex justify-between items-center mb-1.5">
                    <label for="auth-password" class="block text-xs font-semibold text-white/70 uppercase tracking-wide">Kata Sandi</label>
                    <a routerLink="/auth/forgot-password" class="text-xs text-brand-400 hover:underline">Lupa kata sandi?</a>
                  </div>
                  <input
                    id="auth-password"
                    type="password"
                    formControlName="password"
                    class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                    placeholder="••••••••"
                    autocomplete="current-password" />
                </div>

                <app-button type="submit" variant="primary" size="lg" fullWidth [loading]="isLoading">
                  Masuk Akun
                </app-button>
              </div>
            </form>
          }

          <!-- Register Form -->
          @if (activeTab === 'register') {
            <form [formGroup]="registerForm" (ngSubmit)="onRegister()" novalidate>
              <div class="space-y-5">
                <div>
                  <label for="reg-name" class="block text-xs font-semibold text-white/70 uppercase tracking-wide mb-1.5">Nama Lengkap</label>
                  <input id="reg-name" type="text" formControlName="fullName" class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="Sesuai KTP / Berkas" autocomplete="name" />
                </div>
                <div>
                  <label for="reg-email" class="block text-xs font-semibold text-white/70 uppercase tracking-wide mb-1.5">Email</label>
                  <input id="reg-email" type="email" formControlName="email" class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="nama@email.com" autocomplete="email" />
                </div>
                <div>
                  <label for="reg-password" class="block text-xs font-semibold text-white/70 uppercase tracking-wide mb-1.5">Kata Sandi</label>
                  <input id="reg-password" type="password" formControlName="password" class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="Minimal 8 karakter" autocomplete="new-password" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-white/70 uppercase tracking-wide mb-2">Daftar Sebagai</label>
                  <div class="grid grid-cols-2 gap-3">
                    <label class="flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors"
                      [ngClass]="registerForm.get('role')?.value === 'CUSTOMER' ? 'border-brand-400 bg-brand-900/50' : 'border-white/20'">
                      <input type="radio" formControlName="role" value="CUSTOMER" class="text-brand-500" />
                      <span class="text-sm text-white">Klien</span>
                    </label>
                    <label class="flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors"
                      [ngClass]="registerForm.get('role')?.value === 'LEGAL_PRO' ? 'border-brand-400 bg-brand-900/50' : 'border-white/20'">
                      <input type="radio" formControlName="role" value="LEGAL_PRO" class="text-brand-500" />
                      <span class="text-sm text-white">Advokat</span>
                    </label>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <input id="reg-terms" type="checkbox" formControlName="termsAccepted" class="mt-0.5 rounded" />
                  <label for="reg-terms" class="text-xs text-white/60 leading-relaxed">
                    Saya setuju dengan <a routerLink="/legal/terms" class="text-brand-400 hover:underline">Syarat & Ketentuan</a> dan <a routerLink="/legal/privacy" class="text-brand-400 hover:underline">Kebijakan Privasi</a> LegalConnect.
                  </label>
                </div>
                <app-button type="submit" variant="gold" size="lg" fullWidth [loading]="isLoading">
                  Buat Akun Gratis
                </app-button>
              </div>
            </form>
          }
        </div>
      </div>
    </div>
  `
})
export class AuthPageComponent {
  private readonly fb = inject(FormBuilder);

  public activeTab: 'login' | 'register' = 'login';
  public isLoading = false;

  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  public registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['CUSTOMER', Validators.required],
    termsAccepted: [false, Validators.requiredTrue]
  });

  public onLogin(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    setTimeout(() => { this.isLoading = false; }, 1500);
  }

  public onRegister(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;
    this.isLoading = true;
    setTimeout(() => { this.isLoading = false; }, 1500);
  }
}
