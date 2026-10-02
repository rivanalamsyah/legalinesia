import { UserRole } from './role.enum';
import { UserProfile } from './user.model';

export interface LoginCredentials {
  email: string;
  passwordHash: string;
  roleHint?: UserRole;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  passwordHash: string;
  phoneNumber: string;
  role: UserRole.CUSTOMER | UserRole.LEGAL_PRO;
  customerType?: 'INDIVIDUAL' | 'BUSINESS';
  barLicenseNumber?: string;
  termsAccepted: boolean;
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  user: UserProfile;
  expiresAt: string;
}
