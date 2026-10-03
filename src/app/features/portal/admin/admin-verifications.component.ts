import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCmsService, AdminVerificationRequest } from '../../../core/services/admin-cms.service';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { ConfirmationDialogComponent } from '../../../shared/components/ui/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-admin-verifications',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PortalPageHeaderComponent,
    ButtonComponent,
    IconComponent,
    ConfirmationDialogComponent
  ],
  template: `
    <div class="space-y-8">
      <!-- Page Header -->
      <app-portal-page-header
        categoryLabel="Platform Management CMS"
        title="Verifikasi Advokat & Lisensi Legal"
        subtitle="Pemeriksaan dokumen identitas KTP, Sertifikat Keanggotaan PERADI/KAI, serta Nomor Induk Advokat (NIA) calon partner."
        [breadcrumbs]="[{ label: 'Admin CMS', url: '/portal/admin' }, { label: 'Verifikasi Advokat' }]">
        
        <div class="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg font-mono">
          {{ adminService.pendingVerificationsCount() }} Permohonan Perlu Review
        </div>
      </app-portal-page-header>

      <!-- Verifications List -->
      @if (adminService.verifications().length > 0) {
        <div class="space-y-4">
          @for (req of adminService.verifications(); track req.id) {
            <div class="glass-panel p-6 rounded-2xl border border-navy-800 hover:border-brand-500/40 transition-all space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-800 pb-3">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">{{ req.id }}</span>
                  <span
                    class="text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase"
                    [class]="req.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : req.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'"
                  >
                    {{ req.status }}
                  </span>
                </div>
                <span class="text-xs text-white/40 font-mono">Diajukan: {{ req.submittedAt }}</span>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Advocate Identity & Credential info -->
                <div class="lg:col-span-2 space-y-3">
                  <div>
                    <h3 class="text-base font-semibold text-white font-heading">{{ req.fullName }}</h3>
                    <p class="text-xs text-white/60 font-mono">{{ req.email }}</p>
                  </div>

                  <div class="bg-navy-950/70 p-4 rounded-xl border border-navy-800 space-y-2 text-xs">
                    <div class="flex justify-between py-1 border-b border-navy-800/60">
                      <span class="text-white/50">Organisasi Advokat:</span>
                      <span class="text-white font-semibold">{{ req.barAssociation }}</span>
                    </div>
                    <div class="flex justify-between py-1 border-b border-navy-800/60">
                      <span class="text-white/50">Nomor Induk Advokat (NIA):</span>
                      <span class="text-brand-300 font-mono font-bold">{{ req.barLicenseNumber }}</span>
                    </div>
                    <div class="flex justify-between py-1">
                      <span class="text-white/50">Spesialisasi Praktik:</span>
                      <span class="text-gold-400 font-medium">{{ req.specializations.join(', ') }}</span>
                    </div>
                  </div>

                  <!-- Document Uploaded Proofs -->
                  <div class="flex flex-wrap items-center gap-3 pt-1">
                    @if (req.barCertificateUrl) {
                      <div class="p-2.5 rounded-xl bg-navy-900 border border-navy-800 flex items-center gap-2 text-xs">
                        <app-icon name="file-text" size="xs" class="text-brand-400"></app-icon>
                        <span class="text-white/80 font-medium">{{ req.barCertificateUrl }}</span>
                        <app-button variant="outline" size="xs">Buka Dokumen</app-button>
                      </div>
                    }
                    @if (req.identityDocumentUrl) {
                      <div class="p-2.5 rounded-xl bg-navy-900 border border-navy-800 flex items-center gap-2 text-xs">
                        <app-icon name="file-text" size="xs" class="text-brand-400"></app-icon>
                        <span class="text-white/80 font-medium">{{ req.identityDocumentUrl }}</span>
                        <app-button variant="outline" size="xs">Buka KTP</app-button>
                      </div>
                    }
                  </div>
                </div>

                <!-- Action Panel -->
                <div class="bg-navy-950/60 p-4 rounded-xl border border-navy-800 flex flex-col justify-between space-y-4">
                  <div class="space-y-2">
                    <div class="text-xs font-semibold text-white/60 uppercase tracking-wider">Keputusan Admin</div>
                    @if (req.status === 'VERIFIED') {
                      <div class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                        Lisensi advokat telah diverifikasi resmi. Profil telah terbit di direktori publik.
                      </div>
                    }
                    @if (req.status === 'REJECTED') {
                      <div class="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs space-y-1">
                        <div class="font-bold">Permohonan Ditolak</div>
                        <p class="text-white/80 italic">"{{ req.rejectionReason || 'Dokumen tidak valid' }}"</p>
                      </div>
                    }
                    @if (req.status === 'PENDING') {
                      <p class="text-xs text-white/70 leading-relaxed">
                        Periksa keabsahan NIA pada database keorganisasian advokat sebelum menyetujui permohonan.
                      </p>
                    }
                  </div>

                  @if (req.status === 'PENDING') {
                    <div class="flex items-center gap-2 pt-2 border-t border-navy-800">
                      <app-button variant="primary" size="xs" class="w-full" iconLeft="check" (click)="confirmApprove(req.id)">
                        Setujui & Verifikasi
                      </app-button>
                      <app-button variant="danger" size="xs" iconLeft="x" (click)="openRejectModal(req.id)">
                        Tolak
                      </app-button>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="glass-panel p-12 text-center rounded-2xl border border-navy-800 space-y-3">
          <div class="w-14 h-14 rounded-full bg-navy-800 text-white/40 flex items-center justify-center mx-auto">
            <app-icon name="badge-check" size="lg"></app-icon>
          </div>
          <h3 class="text-base font-semibold text-white">Tidak ada permohonan verifikasi pending</h3>
          <p class="text-xs text-white/50 max-w-sm mx-auto">Semua permohonan lisensi advokat telah diperiksa oleh tim admin.</p>
        </div>
      }

      <!-- Approve Confirmation Dialog -->
      <app-confirmation-dialog
        [isOpen]="approveId() !== null"
        title="Verifikasi Lisensi Advokat?"
        message="Apakah Anda yakin ingin memverifikasi lisensi advokat ini? Status profil advokat akan diubah menjadi VERIFIED dan langsung tampil di direktori publik."
        confirmText="Verifikasi Resmi"
        variant="info"
        (confirm)="onConfirmApprove()"
        (cancel)="approveId.set(null)">
      </app-confirmation-dialog>

      <!-- Rejection Reason Modal -->
      @if (rejectId()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="glass-panel w-full max-w-md p-6 rounded-2xl border border-navy-800 space-y-4">
            <div class="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 class="text-base font-semibold text-white font-heading">Tolak Permohonan Verifikasi</h3>
              <button (click)="rejectId.set(null)" class="text-white/40 hover:text-white">
                <app-icon name="x" size="sm"></app-icon>
              </button>
            </div>

            <div class="space-y-3 text-xs">
              <p class="text-white/70 leading-relaxed">
                Masukkan alasan penolakan verifikasi lisensi (misal: dokumen KTP/Sertifikat PERADI buram, NIA tidak terdaftar).
              </p>

              <div>
                <label class="block text-white/60 mb-1 font-semibold">Alasan Penolakan</label>
                <textarea
                  [(ngModel)]="rejectionReason"
                  rows="3"
                  placeholder="Misal: Nomor NIA tidak terdaftar di database resmi PERADI..."
                  class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white"
                ></textarea>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-3 border-t border-navy-800">
              <app-button variant="danger" size="sm" class="w-full" (click)="onConfirmReject()">Konfirmasi Tolak</app-button>
              <app-button variant="outline" size="sm" (click)="rejectId.set(null)">Batal</app-button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class AdminVerificationsComponent {
  public readonly adminService = inject(AdminCmsService);

  public approveId = signal<string | null>(null);
  public rejectId = signal<string | null>(null);
  public rejectionReason = '';

  public confirmApprove(id: string): void {
    this.approveId.set(id);
  }

  public onConfirmApprove(): void {
    const id = this.approveId();
    if (id) {
      this.adminService.approveVerification(id);
      this.approveId.set(null);
    }
  }

  public openRejectModal(id: string): void {
    this.rejectId.set(id);
    this.rejectionReason = '';
  }

  public onConfirmReject(): void {
    const id = this.rejectId();
    if (id && this.rejectionReason) {
      this.adminService.rejectVerification(id, this.rejectionReason);
      this.rejectId.set(null);
    }
  }
}
