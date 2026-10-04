export interface NavItem {
  label: string;
  route: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}

export interface NavigationConfig {
  headerNav: NavItem[];
  footerNav: {
    services: NavItem[];
    company: NavItem[];
    legal: NavItem[];
    support: NavItem[];
  };
  authRoutes: {
    login: string;
    register: string;
    forgotPassword: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    whatsappUrl: string;
  };
}

export const PUBLIC_NAVIGATION_CONFIG: NavigationConfig = {
  headerNav: [
    { label: 'Layanan Hukum', route: '/services' },
    { label: 'Konsultan Hukum', route: '/professionals' },
    { label: 'Cara Kerja', route: '/how-it-works' },
    { label: 'Insight', route: '/insights' },
    { label: 'Tentang Kami', route: '/about' },
  ],
  footerNav: {
    services: [
      { label: 'Pendirian PT / CV / PMA', route: '/services' },
      { label: 'Konsultasi Perceraian & Keluarga', route: '/services' },
      { label: 'Review & Pembuatan Kontrak Bisnis', route: '/services' },
      { label: 'Pendaftaran HKI & Merek Usaha', route: '/services' },
      { label: 'Pendampingan Kasus Pidana', route: '/services' },
      { label: 'Audit & Sengketa Pertanahan', route: '/services' },
    ],
    company: [
      { label: 'Tentang Legalinesia', route: '/about' },
      { label: 'Tim Advokat Berlisensi', route: '/professionals' },
      { label: 'Cara Kerja Layanan', route: '/how-it-works' },
      { label: 'Hubungi Kami', route: '/contact' },
    ],
    legal: [
      { label: 'Syarat & Ketentuan', route: '/contact' },
      { label: 'Kebijakan Privasi', route: '/contact' },
      { label: 'Kode Etik Advokat', route: '/contact' },
    ],
    support: [
      { label: 'Pusat Bantuan & FAQ', route: '/about' },
      { label: 'Artikel & Edukasi Hukum', route: '/insights' },
      { label: 'Mulai Konsultasi Online', route: '/booking' },
    ]
  },
  authRoutes: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password'
  },
  contactInfo: {
    phone: '+62 21 5088 9900',
    email: 'support@legalinesia.id',
    address: 'Sequis Tower Lt. 18, Jl. Jend. Sudirman Kav. 71, Jakarta Selatan 12190',
    whatsappUrl: 'https://wa.me/628119900881'
  }
};
