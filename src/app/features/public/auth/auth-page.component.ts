import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { FirebaseAuthService } from '../../../core/firebase/firebase-auth.service';
import { UserRole } from '../../../core/models/role.enum';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, ButtonComponent, IconComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-brand-900 to-navy-800 flex items-center justify-center p-4 pt-24 pb-12">
      <div class="w-full max-w-md space-y-6">

        <!-- Logo -->
        <div class="text-center">
          <a routerLink="/" class="inline-flex items-center justify-center group py-1" aria-label="Legalinesia - Beranda">
            <img
              src="/logo-legalinesia.png"
              alt="Legalinesia"
              class="h-12 md:h-14 w-auto object-contain transition-transform group-hover:scale-105" />
          </a>
        </div>

        <!-- Error Feedback Banner -->
        @if (errorMessage) {
          <div class="bg-red-500/20 border border-red-400/40 rounded-2xl p-4 text-xs text-red-200 flex items-start gap-2">
            <app-icon name="alert-triangle" size="sm" className="text-red-400 shrink-0 mt-0.5"></app-icon>
            <div>{{ errorMessage }}</div>
          </div>
        }

        <!-- Card -->
        <div class="glass-panel-dark rounded-3xl p-8 shadow-2xl">
          <!-- Tabs -->
          <div class="flex gap-1 bg-white/5 rounded-xl p-1 mb-6">
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

          <!-- Google OAuth Button -->
          <div class="mb-6">
            <button
              type="button"
              (click)="onLoginWithGoogle()"
              [disabled]="isLoading"
              class="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-gray-100 text-slate-800 font-semibold text-sm shadow-md transition-all border border-slate-200 disabled:opacity-50">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{{ activeTab === 'login' ? 'Masuk dengan Google' : 'Daftar dengan Google' }}</span>
            </button>

            <!-- Divider -->
            <div class="relative my-6 text-center">
              <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-white/15"></div></div>
              <span class="relative px-3 bg-navy-800 text-xs text-white/50 uppercase tracking-wider">Atau dengan Email</span>
            </div>
          </div>

          <!-- Login Form (Email & Password) -->
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

          <!-- Register Form (Email & Password) -->
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

                <div class="flex items-start gap-2">
                  <input id="reg-terms" type="checkbox" formControlName="termsAccepted" class="mt-0.5 rounded" />
                  <label for="reg-terms" class="text-xs text-white/60 leading-relaxed">
                    Saya setuju dengan <a routerLink="/contact" class="text-brand-400 hover:underline">Syarat & Ketentuan</a> dan <a routerLink="/contact" class="text-brand-400 hover:underline">Kebijakan Privasi</a> Legalinesia.
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
  private readonly authState = inject(AuthStateService);
  private readonly firebaseAuth = inject(FirebaseAuthService);
  private readonly router = inject(Router);

  public readonly UserRole = UserRole;
  public activeTab: 'login' | 'register' = 'login';
  public isLoading = false;
  public errorMessage: string | null = null;

  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  public registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    termsAccepted: [false, Validators.requiredTrue]
  });

  public async onLoginWithGoogle(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;

    const result = await this.firebaseAuth.loginWithGoogle();
    this.isLoading = false;

    if (!result.success) {
      this.errorMessage = result.error || 'Gagal masuk dengan Google.';
    }
  }

  public async onLogin(): Promise<void> {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    const result = await this.firebaseAuth.login(email, password);
    this.isLoading = false;

    if (!result.success) {
      this.errorMessage = result.error || 'Login gagal. Periksa kembali email dan kata sandi Anda.';
    }
  }

  public async onRegister(): Promise<void> {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    const fullName = this.registerForm.get('fullName')?.value;
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;

    const result = await this.firebaseAuth.register(fullName, email, password, 'CUSTOMER');
    this.isLoading = false;

    if (!result.success) {
      this.errorMessage = result.error || 'Pendaftaran akun gagal. Silakan coba kembali.';
    }
  }
}
