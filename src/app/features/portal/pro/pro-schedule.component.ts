import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProBookingService } from '../../../core/services/pro-booking.service';
import { PortalPageHeaderComponent } from '../../../shared/components/ui/portal-page-header/portal-page-header.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { IconComponent } from '../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-pro-schedule',
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
        title="Jadwal & Ketersediaan Konsultasi"
        subtitle="Atur slot jam kerja mingguan dan tanggal libur di mana Anda tersedia untuk konsultasi klien."
        [breadcrumbs]="[{ label: 'Portal Advokat', url: '/portal/pro' }, { label: 'Jadwal & Ketersediaan' }]">
        
        <div class="text-xs text-brand-300 bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-lg font-mono">
          Zona Waktu: {{ proService.schedule().timezone }}
        </div>
      </app-portal-page-header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Weekly Time Slots (2 cols) -->
        <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-navy-800 space-y-6">
          <div class="flex items-center justify-between border-b border-navy-800 pb-4">
            <h3 class="text-base font-semibold text-white font-heading flex items-center gap-2">
              <app-icon name="clock" size="sm" class="text-brand-400"></app-icon>
              <span>Slot Ketersediaan Mingguan</span>
            </h3>
            <span class="text-xs text-white/50">Klik tombol untuk mengaktifkan / menonaktifkan slot</span>
          </div>

          <div class="space-y-3">
            @for (slot of proService.schedule().weeklySlots; track slot.id) {
              <div
                class="p-4 rounded-xl border transition-all flex items-center justify-between gap-4"
                [class]="slot.isActive ? 'bg-navy-950/80 border-navy-800' : 'bg-navy-950/30 border-navy-900 opacity-60'"
              >
                <div class="flex items-center gap-4">
                  <span class="text-xs font-bold text-white uppercase font-mono w-24 bg-navy-900 px-2.5 py-1 rounded text-center border border-navy-800">
                    {{ slot.dayOfWeek }}
                  </span>
                  <div>
                    <div class="text-sm font-semibold text-white">{{ slot.startTime }} - {{ slot.endTime }} WIB</div>
                    <div class="text-xs text-white/50">Tipe: {{ slot.appointmentType }}</div>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <span
                    class="text-xs px-2.5 py-1 rounded-full font-semibold"
                    [class]="slot.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-navy-800 text-white/40'"
                  >
                    {{ slot.isActive ? 'Aktif Menerima' : 'Non-Aktif' }}
                  </span>
                  <app-button
                    [variant]="slot.isActive ? 'outline' : 'primary'"
                    size="xs"
                    (click)="onToggleSlot(slot.id)"
                  >
                    {{ slot.isActive ? 'Matikan' : 'Aktifkan' }}
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
                <label class="block text-white/60 mb-1">Alasan Berhalangan / Agendakan</label>
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
                  </div>
                }
              </div>
            } @else {
              <p class="text-xs text-white/40">Tidak ada tanggal diblokir.</p>
            }
          </div>

        </div>

      </div>
    </div>
  `
})
export class ProScheduleComponent {
  public readonly proService = inject(ProBookingService);

  public blockDateInput = '';
  public blockReasonInput = '';

  public onToggleSlot(slotId: string): void {
    this.proService.toggleTimeSlot(slotId);
  }

  public onAddBlockedDate(): void {
    if (!this.blockDateInput) return;
    this.proService.addBlockedDate(this.blockDateInput, this.blockReasonInput);
    this.blockDateInput = '';
    this.blockReasonInput = '';
  }
}
