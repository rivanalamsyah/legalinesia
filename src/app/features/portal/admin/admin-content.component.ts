import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCmsService } from '../../../core/services/admin-cms.service';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PortalPageHeaderComponent,
    ButtonComponent,
    IconComponent
  ],
  template: `
    <div class="space-y-8">
      <!-- Page Header -->
      <app-portal-page-header
        categoryLabel="Platform Management CMS"
        title="Kelola Konten & Master Data Platform"
        subtitle="Pusat tata kelola master taxonomi bidang hukum (Practice Areas), katalog layanan publik, dan edukasi legal insight."
        [breadcrumbs]="[{ label: 'Admin CMS', url: '/portal/admin' }, { label: 'Kelola Konten' }]">
        
        <app-button variant="primary" size="sm" iconLeft="plus" (click)="openAddPracticeAreaModal()">
          Tambah Kategori Praktik Baru
        </app-button>
      </app-portal-page-header>

      <!-- Content Management Tabs -->
      <div class="flex items-center gap-2 border-b border-navy-800 pb-3">
        <button
          (click)="activeTab.set('PRACTICE_AREAS')"
          [class]="activeTab() === 'PRACTICE_AREAS'
            ? 'px-4 py-2 rounded-xl bg-brand-500 text-white font-semibold text-xs transition-all shadow-sm'
            : 'px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-navy-800 font-medium text-xs transition-all'"
        >
          Master Taxonomi Praktik ({{ adminService.practiceAreas().length }})
        </button>

        <button
          (click)="activeTab.set('INSIGHTS')"
          [class]="activeTab() === 'INSIGHTS'
            ? 'px-4 py-2 rounded-xl bg-brand-500 text-white font-semibold text-xs transition-all shadow-sm'
            : 'px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-navy-800 font-medium text-xs transition-all'"
        >
          Artikel Legal Insights (24)
        </button>
      </div>

      <!-- Tab 1: Practice Areas Master Data -->
      @if (activeTab() === 'PRACTICE_AREAS') {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (area of adminService.practiceAreas(); track area.id) {
            <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3 hover:border-brand-500/40 transition-all flex flex-col justify-between">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-brand-400">
                    <app-icon [name]="area.iconName || 'folder'" size="sm"></app-icon>
                    <span class="text-xs font-mono font-bold">{{ area.slug }}</span>
                  </div>
                  <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-semibold border border-purple-500/20">
                    {{ area.popularServicesCount || 0 }} Layanan Terhubung
                  </span>
                </div>

                <h3 class="text-base font-semibold text-white font-heading">{{ area.name }}</h3>
                <p class="text-xs text-white/70 leading-relaxed">{{ area.description }}</p>
              </div>

              <div class="pt-3 border-t border-navy-800 flex items-center justify-between text-xs">
                <span class="text-white/40">Master Taxonomy ID: {{ area.id }}</span>
                <app-button variant="outline" size="xs" iconLeft="edit">Sunting Kategori</app-button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Tab 2: Insights & CMS -->
      @if (activeTab() === 'INSIGHTS') {
        <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
          <div class="flex items-center justify-between border-b border-navy-800 pb-3">
            <h3 class="text-base font-semibold text-white font-heading">Artikel Edukasi & Legal Insights</h3>
            <app-button variant="primary" size="xs" iconLeft="plus">Tulis Artikel Baru</app-button>
          </div>

          <div class="space-y-3 text-xs">
            <div class="p-4 rounded-xl bg-navy-950/70 border border-navy-800 flex items-center justify-between">
              <div class="space-y-1">
                <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold uppercase">PUBLISHED</span>
                <h4 class="text-sm font-semibold text-white">Panduan Lengkap Syarat & Biaya Pendirian PT PT PMA Tahun 2026</h4>
                <p class="text-white/60">Penulis: Bambang Sutrisno, S.H., M.H. • Kategori: Hukum Bisnis</p>
              </div>
              <app-button variant="outline" size="xs">Sunting Artikel</app-button>
            </div>

            <div class="p-4 rounded-xl bg-navy-950/70 border border-navy-800 flex items-center justify-between">
              <div class="space-y-1">
                <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold uppercase">PUBLISHED</span>
                <h4 class="text-sm font-semibold text-white">Cara Menanggapi Surat Somasi Sengketa Merek Dagang</h4>
                <p class="text-white/60">Penulis: Tim Legalinesia • Kategori: HKI & Hak Cipta</p>
              </div>
              <app-button variant="outline" size="xs">Sunting Artikel</app-button>
            </div>
          </div>
        </div>
      }

      <!-- Add Practice Area Modal -->
      @if (showAddAreaModal()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="glass-panel w-full max-w-md p-6 rounded-2xl border border-navy-800 space-y-4">
            <div class="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 class="text-base font-semibold text-white font-heading">Tambah Bidang Hukum (Master Taxonomy)</h3>
              <button (click)="showAddAreaModal.set(false)" class="text-white/40 hover:text-white">
                <app-icon name="x" size="sm"></app-icon>
              </button>
            </div>

            <div class="space-y-3 text-xs">
              <div>
                <label class="block text-white/60 mb-1">Nama Bidang Praktik Hukum</label>
                <input type="text" [(ngModel)]="newAreaName" placeholder="Misal: Hukum Ketenagakerjaan & Hubungan Industrial" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white" />
              </div>

              <div>
                <label class="block text-white/60 mb-1">Deskripsi Singkat Bidang Praktik</label>
                <textarea [(ngModel)]="newAreaDesc" rows="3" placeholder="Penjelasan ruang lingkup bidang hukum..." class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white"></textarea>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-3 border-t border-navy-800">
              <app-button variant="primary" size="sm" class="w-full" (click)="onSavePracticeArea()">Simpan Master Data</app-button>
              <app-button variant="outline" size="sm" (click)="showAddAreaModal.set(false)">Batal</app-button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class AdminContentComponent {
  public readonly adminService = inject(AdminCmsService);

  public activeTab = signal<'PRACTICE_AREAS' | 'INSIGHTS'>('PRACTICE_AREAS');
  public showAddAreaModal = signal<boolean>(false);

  public newAreaName = '';
  public newAreaDesc = '';

  public openAddPracticeAreaModal(): void {
    this.showAddAreaModal.set(true);
  }

  public onSavePracticeArea(): void {
    if (!this.newAreaName) return;

    this.adminService.addPracticeArea({
      name: this.newAreaName,
      description: this.newAreaDesc,
      iconName: 'folder'
    });

    this.showAddAreaModal.set(false);
    this.newAreaName = '';
    this.newAreaDesc = '';
  }
}
