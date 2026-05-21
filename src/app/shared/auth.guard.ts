// shared/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Leer roles requeridos de la ruta
  const rolesRequeridos: string[] = route.data?.['roles'] ?? [];

  if (rolesRequeridos.length === 0) return true;

  // Decodificar el JWT para leer el rol del usuario
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const rolUsuario: string = payload.role ?? payload.rol ?? '';

    if (rolesRequeridos.includes(rolUsuario)) {
      return true;
    }

    // Tiene token pero no tiene el rol → redirigir según su rol
    router.navigate(['/dashboard']);
    return false;

  } catch {
    // Token malformado
    localStorage.removeItem('token');
    router.navigate(['/login']);
    return false;
  }
};
