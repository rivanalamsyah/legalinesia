import { Injectable, signal, computed } from '@angular/core';
import { UserProfile, CustomerProfile, LegalProfessionalProfile, AdminProfile } from '../models/user.model';
import { UserRole } from '../models/role.enum';

export const DEMO_CUSTOMER_USER: CustomerProfile = {
  id: 'cust-demo-101',
  email: 'budi.santoso@example.com',
  fullName: 'Budi Santoso',
  phoneNumber: '+6281234567890',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: UserRole.CUSTOMER,
  customerType: 'INDIVIDUAL',
  city: 'Jakarta Selatan',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isEmailVerified: true
};

export const DEMO_LEGAL_PRO_USER: LegalProfessionalProfile = {
  id: 'pro-demo-202',
  email: 'bambang.sutrisno@legalconnect.id',
  fullName: 'Bambang Sutrisno, S.H., M.H.',
  phoneNumber: '+62811998877',
  avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  role: UserRole.LEGAL_PRO,
  title: 'Advokat Senior & Konsultan Hukum Bisnis',
  barLicenseNumber: 'PERADI/2012/84729',
  specializations: ['Hukum Perdata', 'Hukum Bisnis & Korporasi', 'Pertanahan & Properti'],
  yearsOfExperience: 12,
  lawFirmName: 'Bambang & Partners Law Office',
  bio: 'Spesialis hukum perdata, sengketa bisnis, dan pendirian perseroan dengan pengalaman lebih dari 12 tahun.',
  rating: 4.9,
  reviewCount: 128,
  consultationFee: 350000,
  locationCity: 'Jakarta Selatan',
  isVerified: true,
  education: ['S1 Hukum UI', 'S2 Hukum Bisnis UGM'],
  languages: ['Indonesia', 'Inggris'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isEmailVerified: true
};

export const DEMO_ADMIN_USER: AdminProfile = {
  id: 'admin-demo-909',
  email: 'admin.ops@legalconnect.id',
  fullName: 'Administrator Operations',
  phoneNumber: '+628110000111',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  role: UserRole.ADMIN,
  department: 'Platform Operations & Compliance',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isEmailVerified: true
};

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  public readonly currentUser = signal<UserProfile | null>(null);

  public readonly isAuthenticated = computed(() => this.currentUser() !== null);

  public readonly currentRole = computed<UserRole>(() => {
    const user = this.currentUser();
    return user ? user.role : UserRole.PUBLIC;
  });

  public readonly isCustomer = computed(() => this.currentRole() === UserRole.CUSTOMER);
  public readonly isLegalProfessional = computed(() => this.currentRole() === UserRole.LEGAL_PRO);
  public readonly isAdmin = computed(() => this.currentRole() === UserRole.ADMIN);

  public setUser(user: UserProfile | null): void {
    this.currentUser.set(user);
  }

  public loginAsDemo(role: UserRole): UserProfile {
    let user: UserProfile;
    switch (role) {
      case UserRole.LEGAL_PRO:
        user = DEMO_LEGAL_PRO_USER;
        break;
      case UserRole.ADMIN:
        user = DEMO_ADMIN_USER;
        break;
      case UserRole.CUSTOMER:
      default:
        user = DEMO_CUSTOMER_USER;
        break;
    }
    this.setUser(user);
    return user;
  }

  public getPortalRouteForRole(role: UserRole): string {
    switch (role) {
      case UserRole.CUSTOMER:
        return '/portal/customer';
      case UserRole.LEGAL_PRO:
        return '/portal/pro';
      case UserRole.ADMIN:
        return '/portal/admin';
      default:
        return '/';
    }
  }

  public logout(): void {
    this.currentUser.set(null);
  }
}
