import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, BadgeComponent],
  template: `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-navy-800">
        <div>
          <span class="text-xs font-semibold uppercase tracking-wider text-brand-400">Platform Management CMS</span>
          <h2 class="text-2xl font-bold text-white mt-1">
            Ringkasan Operasional LegalConnect
          </h2>
          <p class="text-sm text-white/60 mt-1">
            Pantau pertumbuhan pengguna, verifikasi lisensi advokat, kontrol katalog layanan, dan transaksi platform secara real-time.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <app-badge variant="danger" size="sm">SYSTEM ONLINE</app-badge>
        </div>
      </div>

      <!-- Analytics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-panel p-5 rounded-xl border border-navy-800 flex items-center justify-between">
          <div>
            <span class="text-xs text-white/50 font-medium">Total Pengguna</span>
            <div class="text-2xl font-bold text-white mt-1">1,420</div>
            <span class="text-[11px] text-emerald-400 font-medium">+12% bulan ini</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <app-icon name="users" size="md"></app-icon>
          </div>
        </div>

        <div class="glass-panel p-5 rounded-xl border border-navy-800 flex items-center justify-between">
          <div>
            <span class="text-xs text-white/50 font-medium">Advokat Terverifikasi</span>
            <div class="text-2xl font-bold text-white mt-1">86</div>
            <span class="text-[11px] text-amber-400 font-medium">3 Perlu Verifikasi</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <app-icon name="shield-check" size="md"></app-icon>
          </div>
        </div>

        <div class="glass-panel p-5 rounded-xl border border-navy-800 flex items-center justify-between">
          <div>
            <span class="text-xs text-white/50 font-medium">Total Transaksi Selesai</span>
            <div class="text-2xl font-bold text-white mt-1">340</div>
            <span class="text-[11px] text-white/40">Bulan Oktober 2026</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <app-icon name="receipt" size="md"></app-icon>
          </div>
        </div>

        <div class="glass-panel p-5 rounded-xl border border-navy-800 flex items-center justify-between">
          <div>
            <span class="text-xs text-white/50 font-medium">Artikel Published</span>
            <div class="text-2xl font-bold text-white mt-1">24</div>
            <span class="text-[11px] text-white/40">Legal Insight SEO</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <app-icon name="folder-git-2" size="md"></app-icon>
          </div>
        </div>
      </div>

      <!-- Operations Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3">
          <h3 class="text-base font-semibold text-white">Antrean Verifikasi Advokat</h3>
          <p class="text-xs text-white/60">Periksa kelengkapan KTP, Sertifikat PERADI/KAI, dan foto profil advokat baru.</p>
          <a routerLink="/portal/admin/verifications" class="inline-flex items-center gap-1.5 text-xs text-brand-400 font-semibold hover:underline">
            <span>Tinjau Verifikasi (3)</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3">
          <h3 class="text-base font-semibold text-white">Manajemen Pengguna Platform</h3>
          <p class="text-xs text-white/60">Kelola role pengguna (Klien, Legal Pro, Admin), suspek akun, dan hak akses RBAC.</p>
          <a routerLink="/portal/admin/users" class="inline-flex items-center gap-1.5 text-xs text-brand-400 font-semibold hover:underline">
            <span>Buka Tabel Pengguna</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3">
          <h3 class="text-base font-semibold text-white">Kelola Konten & CMS</h3>
          <p class="text-xs text-white/60">Sunting katalog layanan hukum publik, artikel edukasi, dan FAQ platform.</p>
          <a routerLink="/portal/admin/content" class="inline-flex items-center gap-1.5 text-xs text-brand-400 font-semibold hover:underline">
            <span>Kelola CMS</span>
            <app-icon name="arrow-right" size="xs"></app-icon>
          </a>
        </div>
      </div>

    </div>
  `
})
export class AdminDashboardComponent {}
