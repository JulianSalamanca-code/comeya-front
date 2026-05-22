import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const isBrowser = typeof window !== 'undefined';

  if (!isBrowser) {
    return true;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const rolesRequeridos: string[] = route.data?.['roles'] ?? [];
  if (rolesRequeridos.length === 0) return true;

  const rolUsuario = localStorage.getItem('rol') ?? '';
  if (rolesRequeridos.includes(rolUsuario)) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
