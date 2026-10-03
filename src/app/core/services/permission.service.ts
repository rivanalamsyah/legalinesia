import { Injectable, inject, computed } from '@angular/core';
import { AuthStateService } from './auth-state.service';
import { Permission, ROLE_PERMISSIONS } from '../models/permission.model';
import { UserRole } from '../models/role.enum';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private readonly authState = inject(AuthStateService);

  public readonly userPermissions = computed<Permission[]>(() => {
    const role = this.authState.currentRole();
    return ROLE_PERMISSIONS[role] || [];
  });

  public hasPermission(permission: Permission): boolean {
    return this.userPermissions().includes(permission);
  }

  public hasAnyPermission(permissions: Permission[]): boolean {
    const userPerms = this.userPermissions();
    return permissions.some(p => userPerms.includes(p));
  }

  public hasAllPermissions(permissions: Permission[]): boolean {
    const userPerms = this.userPermissions();
    return permissions.every(p => userPerms.includes(p));
  }

  public hasRole(role: UserRole): boolean {
    return this.authState.currentRole() === role;
  }

  public hasAnyRole(roles: UserRole[]): boolean {
    return roles.includes(this.authState.currentRole());
  }
}
