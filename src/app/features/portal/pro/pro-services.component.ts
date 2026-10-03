import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProBookingService } from '../../../core/services/pro-booking.service';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-pro-services',
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
        categoryLabel="Legal Professional Portal"
        title="Katalog Layanan Hukum Saya"
        subtitle="Kelola dan tawarkan paket konsultasi serta penanganan kasus hukum yang dapat di-booking oleh klien."
        [breadcrumbs]="[{ label: 'Portal Advokat', url: '/portal/pro' }, { label: 'Layanan Hukum' }]">
        
        <app-button variant="primary" size="sm" iconLeft="plus" (click)="showAddModal.set(true)">
          Tambah Layanan Baru
        </app-button>
      </app-portal-page-header>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (srv of proService.services(); track srv.id) {
          <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4 hover:border-brand-500/40 transition-all flex flex-col justify-between">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-300 font-semibold border border-brand-500/20">
                  {{ srv.categoryName }}
                </span>
                @if (srv.isPopular) {
                  <span class="text-[10px] uppercase font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded">Popular</span>
                }
              </div>

              <h3 class="text-base font-semibold text-white font-heading">{{ srv.title }}</h3>
              <p class="text-xs text-white/70 leading-relaxed">{{ srv.description }}</p>

              <div class="bg-navy-950/70 p-3 rounded-xl border border-navy-800 space-y-1">
                <div class="text-xs text-white/50">Honorarium / Tarif:</div>
                <div class="text-lg font-bold text-emerald-400 font-heading">
                  Rp {{ srv.startingPrice.toLocaleString('id-ID') }}
                  <span class="text-xs font-normal text-white/60"> / {{ srv.priceUnit }}</span>
                </div>
                <div class="text-[11px] text-white/40">Estimasi: {{ srv.estimatedDuration }}</div>
              </div>

              @if (srv.keyFeatures && srv.keyFeatures.length > 0) {
                <div class="space-y-1.5 pt-1">
                  <div class="text-xs font-semibold text-white/60">Cakupan Layanan:</div>
                  <ul class="space-y-1">
                    @for (feat of srv.keyFeatures; track feat) {
                      <li class="text-xs text-white/80 flex items-center gap-1.5">
                        <app-icon name="check" size="xs" class="text-emerald-400 shrink-0"></app-icon>
                        <span>{{ feat }}</span>
                      </li>
                    }
                  </ul>
                </div>
              }
            </div>

            <div class="pt-3 border-t border-navy-800 flex items-center gap-2">
              <app-button variant="outline" size="xs" class="w-full" iconLeft="edit">Sunting Tarif & Detail</app-button>
            </div>
          </div>
        }
      </div>

      <!-- Add Service Modal -->
      @if (showAddModal()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="glass-panel w-full max-w-lg p-6 rounded-2xl border border-navy-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 class="text-base font-semibold text-white font-heading">Tambah Layanan Hukum Baru</h3>
              <button (click)="showAddModal.set(false)" class="text-white/40 hover:text-white">
                <app-icon name="x" size="sm"></app-icon>
              </button>
            </div>

            <div class="space-y-3 text-xs">
              <div>
                <label class="block text-white/60 mb-1">Judul Paket Layanan</label>
                <input type="text" [(ngModel)]="newTitle" placeholder="Misal: Review Perjanjian Investasi Startup" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white" />
              </div>

              <div>
                <label class="block text-white/60 mb-1">Kategori Praktik</label>
                <select [(ngModel)]="newCategoryName" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white">
                  <option value="Hukum Bisnis & Korporasi">Hukum Bisnis & Korporasi</option>
                  <option value="Hukum Kontrak & Perjanjian">Hukum Kontrak & Perjanjian</option>
                  <option value="HKI & Hak Cipta">HKI & Hak Cipta</option>
                  <option value="Perceraian & Keluarga">Perceraian & Keluarga</option>
                </select>
              </div>

              <div>
                <label class="block text-white/60 mb-1">Deskripsi Singkat Layanan</label>
                <textarea [(ngModel)]="newDesc" rows="3" placeholder="Penjelasan cakupan dan manfaat..." class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-white/60 mb-1">Tarif (Rp)</label>
                  <input type="number" [(ngModel)]="newPrice" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label class="block text-white/60 mb-1">Estimasi Durasi</label>
                  <input type="text" [(ngModel)]="newDuration" placeholder="60 Menit" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white" />
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-2 border-t border-navy-800">
              <app-button variant="primary" size="sm" class="w-full" (click)="onSaveService()">Simpan Layanan</app-button>
              <app-button variant="outline" size="sm" (click)="showAddModal.set(false)">Batal</app-button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ProServicesComponent {
  public readonly proService = inject(ProBookingService);
  public showAddModal = signal<boolean>(false);

  public newTitle = '';
  public newCategoryName = 'Hukum Bisnis & Korporasi';
  public newDesc = '';
  public newPrice = 500000;
  public newDuration = '60 Menit';

  public onSaveService(): void {
    if (!this.newTitle) return;

    this.proService.addService({
      slug: this.newTitle.toLowerCase().replace(/\s+/g, '-'),
      title: this.newTitle,
      categorySlug: 'hukum-bisnis',
      categoryName: this.newCategoryName,
      summary: this.newDesc,
      description: this.newDesc,
      iconName: 'briefcase',
      startingPrice: this.newPrice,
      priceUnit: 'per consultation',
      estimatedDuration: this.newDuration,
      isPopular: false,
      keyFeatures: ['Konsultasi Nasihat Hukum Live', 'Pemeriksaan Berkas Pertama'],
      deliverables: ['Catatan Advis Legal'],
      recommendedFor: ['Klien Bisnis / Perorangan']
    });

    this.showAddModal.set(false);
    this.newTitle = '';
    this.newDesc = '';
  }
}
