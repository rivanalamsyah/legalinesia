import { UserRole } from '../models/role.enum';
import { BadgeVariant } from '../../shared/components/ui/badge/badge.component';

export interface PortalNavItem {
  id: string;
  label: string;
  route: string;
  iconName: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
}

export interface PortalNavConfig {
  portalTitle: string;
  portalRoleName: string;
  items: PortalNavItem[];
}

export const CUSTOMER_PORTAL_NAV: PortalNavConfig = {
  portalTitle: 'LegalConnect Klien',
  portalRoleName: 'Klien Terverifikasi',
  items: [
    { id: 'dashboard', label: 'Dashboard', route: '/portal/customer/dashboard', iconName: 'layout-dashboard' },
    { id: 'bookings', label: 'Booking Saya', route: '/portal/customer/bookings', iconName: 'calendar-check', badge: 'Aktif', badgeVariant: 'primary' },
    { id: 'consultations', label: 'Sesi Konsultasi', route: '/portal/customer/consultations', iconName: 'video' },
    { id: 'documents', label: 'Dokumen Hukum', route: '/portal/customer/documents', iconName: 'file-text' },
    { id: 'payments', label: 'Pembayaran', route: '/portal/customer/payments', iconName: 'credit-card' },
    { id: 'reviews', label: 'Ulasan Saya', route: '/portal/customer/reviews', iconName: 'star' },
    { id: 'notifications', label: 'Notifikasi', route: '/portal/customer/notifications', iconName: 'bell', badge: '3', badgeVariant: 'gold' },
    { id: 'profile', label: 'Pengaturan Profil', route: '/portal/customer/profile', iconName: 'user' }
  ]
};

export const PRO_PORTAL_NAV: PortalNavConfig = {
  portalTitle: 'LegalConnect Advokat',
  portalRoleName: 'Legal Professional',
  items: [
    { id: 'dashboard', label: 'Ringkasan Kinerja', route: '/portal/pro/dashboard', iconName: 'layout-dashboard' },
    { id: 'schedule', label: 'Jadwal & Ketersediaan', route: '/portal/pro/schedule', iconName: 'clock' },
    { id: 'consultations', label: 'Konsultasi Klien', route: '/portal/pro/consultations', iconName: 'users', badge: '3 Baru', badgeVariant: 'gold' },
    { id: 'case-notes', label: 'Catatan Kasus', route: '/portal/pro/case-notes', iconName: 'notebook-pen' },
    { id: 'services', label: 'Layanan Hukum Saya', route: '/portal/pro/services', iconName: 'briefcase' },
    { id: 'profile', label: 'Profil & Verifikasi', route: '/portal/pro/profile', iconName: 'shield-check' }
  ]
};

export const ADMIN_PORTAL_NAV: PortalNavConfig = {
  portalTitle: 'LegalConnect Admin CMS',
  portalRoleName: 'Platform Administrator',
  items: [
    { id: 'dashboard', label: 'Ringkasan Platform', route: '/portal/admin/dashboard', iconName: 'bar-chart-3' },
    { id: 'users', label: 'Kelola Pengguna', route: '/portal/admin/users', iconName: 'users' },
    { id: 'verifications', label: 'Verifikasi Advokat', route: '/portal/admin/verifications', iconName: 'badge-check', badge: 'Perlu Review', badgeVariant: 'warning' },
    { id: 'content', label: 'Kelola Konten (CMS)', route: '/portal/admin/content', iconName: 'folder-git-2' },
    { id: 'bookings', label: 'Transaksi & Booking', route: '/portal/admin/bookings', iconName: 'receipt' },
    { id: 'settings', label: 'Pengaturan Platform', route: '/portal/admin/settings', iconName: 'settings' }
  ]
};

export function getPortalNavConfigForRole(role: UserRole): PortalNavConfig {
  switch (role) {
    case UserRole.LEGAL_PRO:
      return PRO_PORTAL_NAV;
    case UserRole.ADMIN:
      return ADMIN_PORTAL_NAV;
    case UserRole.CUSTOMER:
    default:
      return CUSTOMER_PORTAL_NAV;
  }
}
