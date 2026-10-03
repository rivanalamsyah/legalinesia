import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StatusType = 
  | 'REQUESTED'
  | 'UNDER_REVIEW'
  | 'WAITING_PAYMENT'
  | 'PAYMENT_VERIFIED'
  | 'CONFIRMED' 
  | 'IN_SESSION'
  | 'COMPLETED' 
  | 'REJECTED'
  | 'CANCELLED' 
  | 'RESCHEDULE_REQUESTED'
  | 'DRAFT' 
  | 'VERIFIED' 
  | 'UNVERIFIED' 
  | 'ACTIVE' 
  | 'INACTIVE';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="containerClasses()">
      <span [class]="dotClasses()"></span>
      <span>{{ label || defaultLabel() }}</span>
    </span>
  `
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: StatusType;
  @Input() label?: string;
  @Input() size: 'sm' | 'md' = 'sm';

  public defaultLabel = computed(() => {
    const labels: Record<StatusType, string> = {
      REQUESTED: 'Diajukan',
      UNDER_REVIEW: 'Ditinjau Advokat',
      WAITING_PAYMENT: 'Menunggu Pembayaran',
      PAYMENT_VERIFIED: 'Pembayaran Diterima',
      CONFIRMED: 'Jadwal Dikonfirmasi',
      IN_SESSION: 'Sesi Berlangsung',
      COMPLETED: 'Selesai',
      REJECTED: 'Ditolak',
      CANCELLED: 'Dibatalkan',
      RESCHEDULE_REQUESTED: 'Jadwal Ulang',
      DRAFT: 'Draft',
      VERIFIED: 'Terverifikasi',
      UNVERIFIED: 'Belum Verifikasi',
      ACTIVE: 'Aktif',
      INACTIVE: 'Non-Aktif'
    };
    return labels[this.status] || this.status;
  });

  public containerClasses = computed(() => {
    const base = 'inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap border transition-colors';
    const sizes = { sm: 'px-2.5 py-0.5 text-xs', md: 'px-3 py-1 text-xs' }[this.size];
    
    const colorStyles: Record<StatusType, string> = {
      REQUESTED: 'bg-brand-500/10 border-brand-500/30 text-brand-300',
      UNDER_REVIEW: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
      WAITING_PAYMENT: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      PAYMENT_VERIFIED: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
      CONFIRMED: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      IN_SESSION: 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold',
      COMPLETED: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
      REJECTED: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      CANCELLED: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
      RESCHEDULE_REQUESTED: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      DRAFT: 'bg-white/5 border-white/10 text-white/60',
      VERIFIED: 'bg-amber-500/15 border-amber-400/40 text-amber-300 font-semibold',
      UNVERIFIED: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
      ACTIVE: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      INACTIVE: 'bg-rose-500/10 border-rose-500/30 text-rose-400'
    };

    return `${base} ${sizes} ${colorStyles[this.status]}`;
  });

  public dotClasses = computed(() => {
    const base = 'w-1.5 h-1.5 rounded-full';
    const dotColors: Record<StatusType, string> = {
      REQUESTED: 'bg-brand-400',
      UNDER_REVIEW: 'bg-purple-400 animate-pulse',
      WAITING_PAYMENT: 'bg-amber-400 animate-pulse',
      PAYMENT_VERIFIED: 'bg-blue-400',
      CONFIRMED: 'bg-emerald-400 animate-pulse',
      IN_SESSION: 'bg-emerald-300 animate-ping',
      COMPLETED: 'bg-blue-400',
      REJECTED: 'bg-rose-400',
      CANCELLED: 'bg-slate-400',
      RESCHEDULE_REQUESTED: 'bg-amber-400',
      DRAFT: 'bg-white/40',
      VERIFIED: 'bg-amber-300',
      UNVERIFIED: 'bg-slate-400',
      ACTIVE: 'bg-emerald-400',
      INACTIVE: 'bg-rose-400'
    };
    return `${base} ${dotColors[this.status]}`;
  });
}
