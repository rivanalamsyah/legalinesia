import { UserRole } from './role.enum';

export interface BaseUser {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  isActive?: boolean;
}

export interface CustomerProfile extends BaseUser {
  role: UserRole.CUSTOMER;
  companyName?: string;
  customerType: 'INDIVIDUAL' | 'BUSINESS';
  city?: string;
}

export interface LegalProfessionalProfile extends BaseUser {
  role: UserRole.LEGAL_PRO;
  title: string; // e.g., "Advokat & Managing Partner"
  barLicenseNumber: string; // e.g., "NIA 12345/PERADI"
  specializations: string[];
  yearsOfExperience: number;
  lawFirmName?: string;
  bio: string;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  locationCity: string;
  isVerified: boolean;
  education: string[];
  languages: string[];
}

export interface AdminProfile extends BaseUser {
  role: UserRole.ADMIN;
  department: string;
}

export type UserProfile = CustomerProfile | LegalProfessionalProfile | AdminProfile;
