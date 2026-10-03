import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProBookingService } from '../../../core/services/pro-booking.service';
import { ConsultationNote } from '../../../core/models/consultation-note.model';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-pro-case-notes',
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
        title="Catatan Kasus & Consultation Notes"
        subtitle="Dokumentasikan hasil konsultasi, resume nasihat hukum (legal opinion), serta rekomendasi tindak lanjut bagi klien."
        [breadcrumbs]="[{ label: 'Portal Advokat', url: '/portal/pro' }, { label: 'Catatan Kasus' }]">
        
        <app-button variant="primary" size="sm" iconLeft="plus" (click)="openCreateModal()">
          Buat Consultation Note Baru
        </app-button>
      </app-portal-page-header>

      <!-- Case Notes Grid -->
      @if (proService.consultationNotes().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (note of proService.consultationNotes(); track note.id) {
            <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4 hover:border-brand-500/40 transition-all flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
                    {{ note.id }}
                  </span>
                  <span
                    class="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
                    [class]="note.isSharedWithCustomer ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gold-500/10 text-gold-400 border border-gold-500/20'"
                  >
                    {{ note.isSharedWithCustomer ? 'Dapat Diakses Klien' : 'Internal Advokat Rahasia' }}
                  </span>
                </div>

                <h3 class="text-base font-semibold text-white font-heading">{{ note.title }}</h3>
                
                <div class="text-xs text-white/50 space-y-1 bg-navy-950/70 p-3 rounded-xl border border-navy-800">
                  <div>Klien: <strong class="text-white/90">{{ note.customerName }}</strong></div>
                  <div>Kategori: <span class="text-brand-300 font-medium">{{ note.caseCategory }}</span></div>
                  <div>Tanggal Dibuat: <span class="text-white/80 font-mono">{{ note.createdAt | date:'dd MMM yyyy HH:mm' }}</span></div>
                </div>

                <div class="space-y-1">
                  <div class="text-xs font-semibold text-white/70">Ringkasan Kasus:</div>
                  <p class="text-xs text-white/80 line-clamp-3 leading-relaxed">{{ note.summary }}</p>
                </div>

                @if (note.actionItems && note.actionItems.length > 0) {
                  <div class="space-y-1 pt-1">
                    <div class="text-xs font-semibold text-purple-300">Rekomendasi Action Items:</div>
                    <ul class="space-y-1">
                      @for (act of note.actionItems; track act) {
                        <li class="text-[11px] text-white/70 flex items-center gap-1.5">
                          <app-icon name="check" size="xs" class="text-purple-400 shrink-0"></app-icon>
                          <span>{{ act }}</span>
                        </li>
                      }
                    </ul>
                  </div>
                }
              </div>

              <div class="pt-3 border-t border-navy-800 flex items-center gap-2">
                <app-button variant="outline" size="xs" class="w-full" iconLeft="eye" (click)="selectedNote.set(note)">
                  Baca Ringkasan Lengkap
                </app-button>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="glass-panel p-12 text-center rounded-2xl border border-navy-800 space-y-3">
          <div class="w-14 h-14 rounded-full bg-navy-800 text-white/40 flex items-center justify-center mx-auto">
            <app-icon name="notebook-pen" size="lg"></app-icon>
          </div>
          <h3 class="text-base font-semibold text-white">Belum ada catatan konsultasi</h3>
          <p class="text-xs text-white/50 max-w-sm mx-auto">Dokumentasikan advis hukum pasca sesi agar klien mendapatkan hasil konsultasi yang terstruktur.</p>
          <app-button variant="primary" size="sm" class="mt-2" iconLeft="plus" (click)="openCreateModal()">Buat Note Sekarang</app-button>
        </div>
      }

      <!-- Create Note Modal -->
      @if (showCreateModal()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="glass-panel w-full max-w-2xl p-6 rounded-2xl border border-navy-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 class="text-base font-semibold text-white font-heading">Tulis Consultation Note Resmi</h3>
              <button (click)="showCreateModal.set(false)" class="text-white/40 hover:text-white">
                <app-icon name="x" size="sm"></app-icon>
              </button>
            </div>

            <div class="space-y-4 text-xs">
              <!-- Select Booking -->
              <div>
                <label class="block text-white/60 mb-1">Pilih Booking Klien</label>
                <select [(ngModel)]="newBookingId" (change)="onBookingSelectChange()" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white">
                  <option value="">-- Pilih Sesi Konsultasi --</option>
                  @for (b of proService.proBookings(); track b.id) {
                    <option [value]="b.id">{{ b.id }} - {{ b.customerName }} ({{ b.serviceTitle }})</option>
                  }
                </select>
              </div>

              <div>
                <label class="block text-white/60 mb-1">Judul Ringkasan Nasihat Hukum</label>
                <input type="text" [(ngModel)]="newTitle" placeholder="Misal: Catatan Legal Opinion Pendirian PT Startup" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white" />
              </div>

              <div>
                <label class="block text-white/60 mb-1">Kategori Masalah Hukum</label>
                <input type="text" [(ngModel)]="newCategory" placeholder="Misal: Hukum Korporasi & OSS RBA" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white" />
              </div>

              <div>
                <label class="block text-white/60 mb-1">Ringkasan Fakta & Posisi Hukum</label>
                <textarea [(ngModel)]="newSummary" rows="3" placeholder="Fakta-fakta penting yang disampaikan klien..." class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white"></textarea>
              </div>

              <div>
                <label class="block text-white/60 mb-1">Nasihat & Rekomendasi Hukum (Legal Advice)</label>
                <textarea [(ngModel)]="newAdvice" rows="4" placeholder="Analisis pasal, klausul, dan rekomendasi langkah legal..." class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white"></textarea>
              </div>

              <div>
                <label class="block text-white/60 mb-1">Confidential Internal Notes (Hanya untuk Rekam Advokat, Klien Tidak Melihat)</label>
                <textarea [(ngModel)]="newConfidential" rows="2" placeholder="Catatan rahasia advokat mengenai karakter klien / taktik litigasi..." class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white text-gold-300"></textarea>
              </div>

              <div class="flex items-center gap-2 pt-2">
                <input type="checkbox" id="shareCheck" [(ngModel)]="newIsShared" class="rounded bg-navy-950 border-navy-800 text-brand-500" />
                <label for="shareCheck" class="text-white/80 cursor-pointer">Bagikan dokumen catatan ini ke portal akun Klien</label>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-4 border-t border-navy-800">
              <app-button variant="primary" size="sm" class="w-full" (click)="onSaveNote()">Simpan & Publikasikan Note</app-button>
              <app-button variant="outline" size="sm" (click)="showCreateModal.set(false)">Batal</app-button>
            </div>
          </div>
        </div>
      }

      <!-- Read Note Modal -->
      @if (selectedNote()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="glass-panel w-full max-w-2xl p-6 rounded-2xl border border-navy-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between border-b border-navy-800 pb-3">
              <div>
                <span class="text-xs font-mono text-purple-400 font-bold">{{ selectedNote()?.id }}</span>
                <h3 class="text-base font-semibold text-white font-heading">{{ selectedNote()?.title }}</h3>
              </div>
              <button (click)="selectedNote.set(null)" class="text-white/40 hover:text-white">
                <app-icon name="x" size="sm"></app-icon>
              </button>
            </div>

            <div class="space-y-4 text-xs">
              <div class="bg-navy-950/80 p-3 rounded-xl border border-navy-800 flex justify-between">
                <div>Klien: <strong class="text-white">{{ selectedNote()?.customerName }}</strong></div>
                <div>Advokat: <strong class="text-brand-300">{{ selectedNote()?.professionalName }}</strong></div>
              </div>

              <div>
                <h5 class="text-white/50 uppercase font-semibold text-[10px] tracking-wider">Ringkasan Fakta</h5>
                <p class="text-white/90 leading-relaxed mt-1 whitespace-pre-line">{{ selectedNote()?.summary }}</p>
              </div>

              <div>
                <h5 class="text-brand-400 uppercase font-semibold text-[10px] tracking-wider">Nasihat Hukum (Legal Opinion)</h5>
                <p class="text-white/90 leading-relaxed mt-1 whitespace-pre-line">{{ selectedNote()?.legalAdvice }}</p>
              </div>

              @if (selectedNote()?.confidentialNotes) {
                <div class="bg-gold-500/10 border border-gold-500/20 p-3 rounded-xl">
                  <h5 class="text-gold-400 uppercase font-bold text-[10px] tracking-wider flex items-center gap-1">
                    <app-icon name="lock" size="xs"></app-icon>
                    Catatan Internal Rahasia Advokat
                  </h5>
                  <p class="text-gold-200 mt-1 italic">{{ selectedNote()?.confidentialNotes }}</p>
                </div>
              }
            </div>

            <div class="pt-3 border-t border-navy-800 flex justify-end">
              <app-button variant="outline" size="sm" (click)="selectedNote.set(null)">Tutup</app-button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ProCaseNotesComponent {
  public readonly proService = inject(ProBookingService);
  public showCreateModal = signal<boolean>(false);
  public selectedNote = signal<ConsultationNote | null>(null);

  public newBookingId = '';
  public newCustomerId = '';
  public newCustomerName = '';
  public newTitle = '';
  public newCategory = '';
  public newSummary = '';
  public newAdvice = '';
  public newConfidential = '';
  public newIsShared = true;

  public openCreateModal(): void {
    this.showCreateModal.set(true);
  }

  public onBookingSelectChange(): void {
    const booking = this.proService.proBookings().find(b => b.id === this.newBookingId);
    if (booking) {
      this.newCustomerId = booking.customerId;
      this.newCustomerName = booking.customerName;
      this.newCategory = booking.practiceArea;
      this.newTitle = `Catatan Konsultasi: ${booking.serviceTitle}`;
    }
  }

  public onSaveNote(): void {
    if (!this.newTitle || !this.newSummary) return;

    this.proService.createConsultationNote({
      bookingId: this.newBookingId,
      customerId: this.newCustomerId,
      customerName: this.newCustomerName || 'Klien',
      title: this.newTitle,
      caseCategory: this.newCategory,
      summary: this.newSummary,
      legalAdvice: this.newAdvice,
      confidentialNotes: this.newConfidential,
      isSharedWithCustomer: this.newIsShared,
      actionItems: ['Menindaklanjuti rekomendasi hasil konsultasi']
    });

    this.showCreateModal.set(false);
    this.resetForm();
  }

  private resetForm(): void {
    this.newBookingId = '';
    this.newTitle = '';
    this.newCategory = '';
    this.newSummary = '';
    this.newAdvice = '';
    this.newConfidential = '';
  }
}
