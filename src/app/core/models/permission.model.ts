import { UserRole } from './role.enum';

export enum Permission {
  // Customer Permissions
  CUSTOMER_VIEW_BOOKINGS = 'customer:view_bookings',
  CUSTOMER_CREATE_BOOKING = 'customer:create_booking',
  CUSTOMER_CANCEL_BOOKING = 'customer:cancel_booking',
  CUSTOMER_VIEW_DOCUMENTS = 'customer:view_documents',
  CUSTOMER_MANAGE_PROFILE = 'customer:manage_profile',

  // Legal Professional Permissions
  PRO_VIEW_SCHEDULE = 'pro:view_schedule',
  PRO_MANAGE_SCHEDULE = 'pro:manage_schedule',
  PRO_VIEW_CLIENTS = 'pro:view_clients',
  PRO_MANAGE_SERVICES = 'pro:manage_services',
  PRO_WRITE_CONSULTATION_NOTE = 'pro:write_consultation_note',
  PRO_VIEW_CASE_FILES = 'pro:view_case_files',
  PRO_EDIT_PROFILE = 'pro:edit_profile',

  // Admin Permissions
  ADMIN_VIEW_ANALYTICS = 'admin:view_analytics',
  ADMIN_MANAGE_USERS = 'admin:manage_users',
  ADMIN_VERIFY_LAWYER = 'admin:verify_lawyer',
  ADMIN_MANAGE_CONTENT = 'admin:manage_content',
  ADMIN_VIEW_ALL_BOOKINGS = 'admin:view_all_bookings',
  ADMIN_MANAGE_SETTINGS = 'admin:manage_settings'
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.PUBLIC]: [],

  [UserRole.CUSTOMER]: [
    Permission.CUSTOMER_VIEW_BOOKINGS,
    Permission.CUSTOMER_CREATE_BOOKING,
    Permission.CUSTOMER_CANCEL_BOOKING,
    Permission.CUSTOMER_VIEW_DOCUMENTS,
    Permission.CUSTOMER_MANAGE_PROFILE
  ],

  [UserRole.LEGAL_PRO]: [
    Permission.PRO_VIEW_SCHEDULE,
    Permission.PRO_MANAGE_SCHEDULE,
    Permission.PRO_VIEW_CLIENTS,
    Permission.PRO_MANAGE_SERVICES,
    Permission.PRO_WRITE_CONSULTATION_NOTE,
    Permission.PRO_VIEW_CASE_FILES,
    Permission.PRO_EDIT_PROFILE
  ],

  [UserRole.ADMIN]: [
    // Admin has full system permissions
    Permission.CUSTOMER_VIEW_BOOKINGS,
    Permission.CUSTOMER_CREATE_BOOKING,
    Permission.CUSTOMER_CANCEL_BOOKING,
    Permission.CUSTOMER_VIEW_DOCUMENTS,
    Permission.CUSTOMER_MANAGE_PROFILE,

    Permission.PRO_VIEW_SCHEDULE,
    Permission.PRO_MANAGE_SCHEDULE,
    Permission.PRO_VIEW_CLIENTS,
    Permission.PRO_MANAGE_SERVICES,
    Permission.PRO_WRITE_CONSULTATION_NOTE,
    Permission.PRO_VIEW_CASE_FILES,
    Permission.PRO_EDIT_PROFILE,

    Permission.ADMIN_VIEW_ANALYTICS,
    Permission.ADMIN_MANAGE_USERS,
    Permission.ADMIN_VERIFY_LAWYER,
    Permission.ADMIN_MANAGE_CONTENT,
    Permission.ADMIN_VIEW_ALL_BOOKINGS,
    Permission.ADMIN_MANAGE_SETTINGS
  ]
};
