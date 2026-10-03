import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-white">Transaksi & Booking Platform</h2>
        <p class="text-xs text-white/60">Monitor seluruh alur pemesanan dan pembayaran konsultasi platform.</p>
      </div>
      <div class="glass-panel p-5 rounded-2xl border border-navy-800 text-xs text-white/70">
        Monitoring 340 transaksi berjalan dengan aman dan transparan.
      </div>
    </div>
  `
})
export class AdminBookingsComponent {}
