import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';
import { PermissionService } from '../services/permission.service';
import { UserRole } from '../models/role.enum';
import { Permission } from '../models/permission.model';

export const authGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (authState.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const authState = inject(AuthStateService);
    const router = inject(Router);

    const userRole = authState.currentRole();

    if (allowedRoles.includes(userRole)) {
      return true;
    }

    if (!authState.isAuthenticated()) {
      router.navigate(['/auth/login']);
    } else {
      router.navigate(['/error/forbidden']);
    }
    return false;
  };
};

export const permissionGuard = (requiredPermissions: Permission[]): CanActivateFn => {
  return () => {
    const authState = inject(AuthStateService);
    const permService = inject(PermissionService);
    const router = inject(Router);

    if (!authState.isAuthenticated()) {
      router.navigate(['/auth/login']);
      return false;
    }

    if (permService.hasAllPermissions(requiredPermissions)) {
      return true;
    }

    router.navigate(['/error/forbidden']);
    return false;
  };
};
