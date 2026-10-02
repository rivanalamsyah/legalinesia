import { Injectable, signal, computed } from '@angular/core';
import { UserProfile } from '../models/user.model';
import { UserRole } from '../models/role.enum';

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

  public logout(): void {
    this.currentUser.set(null);
  }
}
