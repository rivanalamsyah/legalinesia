import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProBookingService } from '../../../core/services/pro-booking.service';
import { DayOfWeek } from '../../../core/models/schedule.model';
import { AppointmentType } from '../../../core/models/booking.model';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';
import { ConfirmationDialogComponent } from '../../../shared/components/ui/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-pro-schedule',
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
        categoryLabel="Legal Professional Portal"
        title="Jadwal & Ketersediaan Konsultasi"
        subtitle="Atur slot jam kerja mingguan dan tanggal libur di mana Anda tersedia untuk konsultasi klien tanpa risiko jadwal bentrok."
        [breadcrumbs]="[{ label: 'Portal Advokat', url: '/portal/pro' }, { label: 'Jadwal & Ketersediaan' }]">
        
        <div class="flex items-center gap-2">
          <div class="text-xs text-brand-300 bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-lg font-mono">
            Zona Waktu: {{ proService.schedule().timezone }}
          </div>
          <app-button variant="primary" size="sm" iconLeft="plus" (click)="showAddSlotModal.set(true)">
            Tambah Slot Jam Kerja
          </app-button>
        </div>
      </app-portal-page-header>

      <!-- Alert Banners -->
      @if (errorMessage()) {
        <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-between">
          <div class="flex items-center gap-2">
            <app-icon name="alert-triangle" size="sm"></app-icon>
            <span>{{ errorMessage() }}</span>
          </div>
          <button (click)="errorMessage.set('')" class="text-rose-400 hover:text-white">
            <app-icon name="x" size="xs"></app-icon>
          </button>
        </div>
      }

      @if (successMessage()) {
        <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
          <div class="flex items-center gap-2">
            <app-icon name="check-circle" size="sm"></app-icon>
            <span>{{ successMessage() }}</span>
          </div>
          <button (click)="successMessage.set('')" class="text-emerald-400 hover:text-white">
            <app-icon name="x" size="xs"></app-icon>
          </button>
        </div>
      }

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Weekly Time Slots (2 cols) -->
        <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-navy-800 space-y-6">
          <div class="flex items-center justify-between border-b border-navy-800 pb-4">
            <h3 class="text-base font-semibold text-white font-heading flex items-center gap-2">
              <app-icon name="clock" size="sm" class="text-brand-400"></app-icon>
              <span>Slot Ketersediaan Mingguan (Weekly Time Slots)</span>
            </h3>
            <span class="text-xs text-white/50">Total {{ proService.schedule().weeklySlots.length }} Slot</span>
          </div>

          <div class="space-y-3">
            @for (slot of proService.schedule().weeklySlots; track slot.id) {
              <div
                class="p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                [class]="slot.isActive ? 'bg-navy-950/80 border-navy-800 hover:border-brand-500/30' : 'bg-navy-950/30 border-navy-900 opacity-60'"
              >
                <div class="flex items-center gap-4">
                  <span class="text-xs font-bold text-white uppercase font-mono w-24 bg-navy-900 px-2.5 py-1 rounded text-center border border-navy-800 shrink-0">
                    {{ slot.dayOfWeek }}
                  </span>
                  <div>
                    <div class="text-sm font-semibold text-white">{{ slot.startTime }} - {{ slot.endTime }} WIB</div>
                    <div class="text-xs text-white/50">Tipe: <span class="text-brand-300 font-medium">{{ slot.appointmentType }}</span></div>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <span
                    class="text-xs px-2.5 py-1 rounded-full font-semibold"
                    [class]="slot.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-navy-800 text-white/40'"
                  >
                    {{ slot.isActive ? 'Aktif' : 'Non-Aktif' }}
                  </span>
                  <app-button
                    [variant]="slot.isActive ? 'outline' : 'primary'"
                    size="xs"
                    (click)="onToggleSlot(slot.id)"
                  >
                    {{ slot.isActive ? 'Matikan' : 'Aktifkan' }}
                  </app-button>
                  <app-button
                    variant="danger"
                    size="xs"
                    iconLeft="trash-2"
                    (click)="confirmDeleteSlot(slot.id)"
                  >
                    Hapus
                  </app-button>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Add Blocked Dates & Rules (1 col) -->
        <div class="space-y-6">

          <!-- Block Date Card -->
          <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-4">
            <h4 class="text-sm font-semibold text-white font-heading flex items-center gap-2">
              <app-icon name="x-circle" size="xs" class="text-rose-400"></app-icon>
              <span>Tambah Tanggal Berhalangan</span>
            </h4>
            
            <div class="space-y-3 text-xs">
              <div>
                <label class="block text-white/60 mb-1">Pilih Tanggal Libur (YYYY-MM-DD)</label>
                <input
                  type="date"
                  [(ngModel)]="blockDateInput"
                  class="w-full bg-navy-950/80 border border-navy-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label class="block text-white/60 mb-1">Alasan Berhalangan / Agenda</label>
                <input
                  type="text"
                  [(ngModel)]="blockReasonInput"
                  placeholder="Misal: Sidang Pengadilan / Cuti"
                  class="w-full bg-navy-950/80 border border-navy-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <app-button variant="danger" size="sm" class="w-full" iconLeft="plus" (click)="onAddBlockedDate()">
                Blokir Tanggal Ini
              </app-button>
            </div>
          </div>

          <!-- Active Blocked List -->
          <div class="glass-panel p-6 rounded-2xl border border-navy-800 space-y-3">
            <h4 class="text-xs uppercase tracking-wider font-semibold text-white/60">Daftar Tanggal Diblokir</h4>
            @if (proService.schedule().blockedDates.length > 0) {
              <div class="space-y-2">
                @for (item of proService.schedule().blockedDates; track item.date) {
                  <div class="p-3 rounded-xl bg-navy-950 border border-navy-800 text-xs flex items-center justify-between">
                    <div>
                      <div class="font-mono text-rose-400 font-bold">{{ item.date }}</div>
                      <div class="text-white/60 mt-0.5">{{ item.reason || 'Tanpa keterangan' }}</div>
                    </div>
                    <button (click)="onRemoveBlockedDate(item.date)" class="text-white/40 hover:text-rose-400 transition-colors">
                      <app-icon name="trash-2" size="xs"></app-icon>
                    </button>
                  </div>
                }
              </div>
            } @else {
              <p class="text-xs text-white/40">Tidak ada tanggal diblokir.</p>
            }
          </div>

        </div>

      </div>

      <!-- Add Time Slot Modal -->
      @if (showAddSlotModal()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="glass-panel w-full max-w-md p-6 rounded-2xl border border-navy-800 space-y-4">
            <div class="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 class="text-base font-semibold text-white font-heading">Tambah Slot Jam Kerja Baru</h3>
              <button (click)="showAddSlotModal.set(false)" class="text-white/40 hover:text-white">
                <app-icon name="x" size="sm"></app-icon>
              </button>
            </div>

            <div class="space-y-3 text-xs">
              <div>
                <label class="block text-white/60 mb-1">Hari Kerja</label>
                <select [(ngModel)]="newDay" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white">
                  <option value="MONDAY">Senin (MONDAY)</option>
                  <option value="TUESDAY">Selasa (TUESDAY)</option>
                  <option value="WEDNESDAY">Rabu (WEDNESDAY)</option>
                  <option value="THURSDAY">Kamis (THURSDAY)</option>
                  <option value="FRIDAY">Jumat (FRIDAY)</option>
                  <option value="SATURDAY">Sabtu (SATURDAY)</option>
                  <option value="SUNDAY">Minggu (SUNDAY)</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-white/60 mb-1">Jam Mulai (HH:MM)</label>
                  <input type="time" [(ngModel)]="newStartTime" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label class="block text-white/60 mb-1">Jam Selesai (HH:MM)</label>
                  <input type="time" [(ngModel)]="newEndTime" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white" />
                </div>
              </div>

              <div>
                <label class="block text-white/60 mb-1">Tipe Sesi Konsultasi</label>
                <select [(ngModel)]="newApptType" class="w-full bg-navy-950 border border-navy-800 rounded-xl p-2.5 text-white">
                  <option value="ONLINE_VIDEO">Online Video Call</option>
                  <option value="IN_PERSON">Tatap Muka / In Person</option>
                  <option value="DOCUMENT_REVIEW">Review Dokumen</option>
                </select>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-3 border-t border-navy-800">
              <app-button variant="primary" size="sm" class="w-full" (click)="onSaveNewSlot()">Simpan Slot</app-button>
              <app-button variant="outline" size="sm" (click)="showAddSlotModal.set(false)">Batal</app-button>
            </div>
          </div>
        </div>
      }

      <!-- Delete Confirmation Dialog -->
      <app-confirmation-dialog
        [isOpen]="slotToDeleteId !== null"
        title="Hapus Slot Jam Kerja?"
        message="Apakah Anda yakin ingin menghapus slot waktu ketersediaan ini? Klien tidak akan dapat melakukan booking pada jam tersebut."
        confirmText="Hapus Slot"
        variant="danger"
        (confirm)="onConfirmDeleteSlot()"
        (cancel)="slotToDeleteId = null">
      </app-confirmation-dialog>

    </div>
  `
})
export class ProScheduleComponent {
  public readonly proService = inject(ProBookingService);

  public showAddSlotModal = signal<boolean>(false);
  public errorMessage = signal<string>('');
  public successMessage = signal<string>('');

  public newDay: DayOfWeek = 'MONDAY';
  public newStartTime = '09:00';
  public newEndTime = '10:00';
  public newApptType: AppointmentType = 'ONLINE_VIDEO';

  public blockDateInput = '';
  public blockReasonInput = '';
  public slotToDeleteId: string | null = null;

  public onToggleSlot(slotId: string): void {
    this.proService.toggleTimeSlot(slotId);
  }

  public confirmDeleteSlot(slotId: string): void {
    this.slotToDeleteId = slotId;
  }

  public onConfirmDeleteSlot(): void {
    if (this.slotToDeleteId) {
      this.proService.deleteTimeSlot(this.slotToDeleteId);
      this.slotToDeleteId = null;
      this.setSuccess('Slot jam kerja berhasil dihapus.');
    }
  }

  public onSaveNewSlot(): void {
    const res = this.proService.addTimeSlot(this.newDay, this.newStartTime, this.newEndTime, this.newApptType);
    if (!res.success) {
      this.setError(res.message || 'Gagal menambahkan slot.');
      return;
    }

    this.showAddSlotModal.set(false);
    this.setSuccess(`Slot jam ${this.newStartTime} - ${this.newEndTime} WIB berhasil ditambahkan.`);
  }

  public onAddBlockedDate(): void {
    if (!this.blockDateInput) {
      this.setError('Silakan pilih tanggal libur terlebih dahulu.');
      return;
    }
    const res = this.proService.addBlockedDate(this.blockDateInput, this.blockReasonInput);
    if (!res.success) {
      this.setError(res.message || 'Gagal memblokir tanggal.');
      return;
    }
    this.blockDateInput = '';
    this.blockReasonInput = '';
    this.setSuccess('Tanggal berhasil ditambahkan ke daftar libur.');
  }

  public onRemoveBlockedDate(dateStr: string): void {
    this.proService.removeBlockedDate(dateStr);
    this.setSuccess(`Tanggal libur ${dateStr} berhasil dihapus.`);
  }

  private setError(msg: string): void {
    this.errorMessage.set(msg);
    setTimeout(() => this.errorMessage.set(''), 5000);
  }

  private setSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(''), 4000);
  }
}
