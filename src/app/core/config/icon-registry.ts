/**
 * Centralized Icon Registry & System Guidelines for Legalinesia
 * 
 * Establishes a single source of truth for semantic icon mapping across all
 * frontend pages, portals, navigation, actions, states, and domain components.
 * Standardized icon family: Lucide (via lucide-angular).
 */

export interface IconDefinition {
  name: string;
  label: string;
  description?: string;
}

/**
 * Standard Icon Sizes (in pixels & Tailwind equivalents):
 * - xs: 14px / w-3.5 h-3.5 (compact controls, inline metadata, badges)
 * - sm: 16px / w-4 h-4 (button prefix/suffix, form inputs, table actions)
 * - md: 20px / w-5 h-5 (standard buttons, navigation items, cards, headers)
 * - lg: 24px / w-6 h-6 (prominent controls, section headers, modal icons)
 * - xl: 32px / w-8 h-8 (hero features, empty states, error/success banners)
 */
export const ICON_SIZES = {
  xs: { px: 14, class: 'w-3.5 h-3.5' },
  sm: { px: 16, class: 'w-4 h-4' },
  md: { px: 20, class: 'w-5 h-5' },
  lg: { px: 24, class: 'w-6 h-6' },
  xl: { px: 32, class: 'w-8 h-8' },
} as const;

export const DEFAULT_STROKE_WIDTH = 1.8;

/**
 * Navigation Icon Mapping
 */
export const NAV_ICONS = {
  dashboard: 'layout-dashboard',
  bookings: 'calendar-days',
  consultations: 'message-square',
  documents: 'file-text',
  payments: 'credit-card',
  reviews: 'star',
  profile: 'user',
  notifications: 'bell',
  services: 'briefcase-business',
  professionals: 'users',
  insights: 'newspaper',
  verifications: 'badge-check',
  contentCms: 'folder-git-2',
  settings: 'settings',
  schedule: 'clock',
  calendar: 'calendar',
  clients: 'user-check',
  caseNotes: 'sticky-note',
  help: 'circle-help',
  logout: 'log-out',
  website: 'globe',
  arrowLeft: 'arrow-left',
  arrowRight: 'arrow-right',
  chevronDown: 'chevron-down',
  menu: 'menu',
  close: 'x',
} as const;

/**
 * Action & Control Icons
 */
export const ACTION_ICONS = {
  add: 'plus',
  edit: 'pencil',
  delete: 'trash-2',
  view: 'eye',
  hide: 'eye-off',
  download: 'download',
  upload: 'upload',
  search: 'search',
  filter: 'sliders-horizontal',
  sort: 'arrow-up-down',
  refresh: 'refresh-cw',
  copy: 'copy',
  share: 'share-2',
  close: 'x',
  check: 'check',
  approve: 'check-circle-2',
  reject: 'x-circle',
  back: 'arrow-left',
  forward: 'arrow-right',
  external: 'external-link',
  expand: 'chevron-down',
  collapse: 'chevron-up',
} as const;

/**
 * Legal & Domain Icons
 */
export const LEGAL_ICONS = {
  scale: 'scale',
  gavel: 'gavel',
  briefcase: 'briefcase-business',
  shield: 'shield-check',
  verification: 'badge-check',
  contract: 'file-text',
  landmark: 'landmark',
  award: 'award',
  userCheck: 'user-check',
  building: 'building-2',
  fileCheck: 'file-check-2',
} as const;

/**
 * System & Status State Icons
 */
export const STATUS_ICONS = {
  success: 'circle-check',
  warning: 'triangle-alert',
  error: 'circle-x',
  info: 'info',
  pending: 'clock',
  loading: 'loader-2',
  active: 'check-circle',
  inactive: 'minus-circle',
  verified: 'badge-check',
  unverified: 'alert-circle',
  draft: 'file-edit',
} as const;

/**
 * Comprehensive Alias Mapping for Legacy/Renamed Lucide Icon Names
 */
export const LUCIDE_ICON_ALIASES: Record<string, string> = {
  'x-circle': 'circle-x',
  'check-circle': 'circle-check',
  'check-circle-2': 'circle-check',
  'alert-circle': 'circle-alert',
  'alert-triangle': 'triangle-alert',
  'help-circle': 'circle-help',
  'plus-circle': 'circle-plus',
  'minus-circle': 'circle-minus',
  'user-circle': 'circle-user',
  'play-circle': 'circle-play',
  'pause-circle': 'circle-pause',
  'stop-circle': 'circle-stop',
  'arrow-up-circle': 'circle-arrow-up',
  'arrow-down-circle': 'circle-arrow-down',
  'arrow-left-circle': 'circle-arrow-left',
  'arrow-right-circle': 'circle-arrow-right',
  'calendar-x': 'calendar-x-2',
  'file-check': 'file-check-2',
  'trash': 'trash-2',
  'close': 'x',
  'logout': 'log-out',
  'dashboard': 'layout-dashboard',
  'help': 'circle-help',
  'briefcase': 'briefcase-business',
  'verification': 'badge-check',
  'shield': 'shield-check',
};
