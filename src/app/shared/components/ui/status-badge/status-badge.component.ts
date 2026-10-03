import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StatusType = 
  | 'CONFIRMED' 
  | 'PENDING_PAYMENT' 
  | 'DRAFT' 
  | 'COMPLETED' 
  | 'CANCELLED' 
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
      CONFIRMED: 'Dikonfirmasi',
      PENDING_PAYMENT: 'Menunggu Pembayaran',
      DRAFT: 'Draft',
      COMPLETED: 'Selesai',
      CANCELLED: 'Dibatalkan',
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
      CONFIRMED: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      PENDING_PAYMENT: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      DRAFT: 'bg-white/5 border-white/10 text-white/60',
      COMPLETED: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
      CANCELLED: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
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
      CONFIRMED: 'bg-emerald-400 animate-pulse',
      PENDING_PAYMENT: 'bg-amber-400 animate-pulse',
      DRAFT: 'bg-white/40',
      COMPLETED: 'bg-blue-400',
      CANCELLED: 'bg-rose-400',
      VERIFIED: 'bg-amber-300',
      UNVERIFIED: 'bg-slate-400',
      ACTIVE: 'bg-emerald-400',
      INACTIVE: 'bg-rose-400'
    };
    return `${base} ${dotColors[this.status]}`;
  });
}
