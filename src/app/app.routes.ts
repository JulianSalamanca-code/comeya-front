import { Routes } from '@angular/router';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login',
    loadComponent: () => import('./login/login').then(m => m.LoginComponent) },

  { path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard], data: { roles: ['USER', 'ADMIN'] } },

  { path: 'menu',
    loadComponent: () => import('./menu/menu').then(m => m.MenuComponent),
    canActivate: [authGuard], data: { roles: ['USER', 'ADMIN'] } },

  { path: 'eventos',
    loadComponent: () => import('./eventos/eventos').then(m => m.EventosComponent),
    canActivate: [authGuard], data: { roles: ['USER', 'ADMIN'] } },

  { path: 'perfil',
    loadComponent: () => import('./perfil/perfil').then(m => m.PerfilComponent),
    canActivate: [authGuard], data: { roles: ['USER', 'ADMIN'] } },

  { path: 'cocina',
    loadComponent: () => import('./admin/cocina/cocina').then(m => m.CocinaComponent),
    canActivate: [authGuard], data: { roles: ['STAFF_COCINA', 'ADMIN'] } },

  { path: 'cajero',
    loadComponent: () => import('./admin/cajero/cajero').then(m => m.CajeroComponent),
    canActivate: [authGuard], data: { roles: ['STAFF_CAJERO', 'ADMIN'] } },

  { path: 'admin',
    loadComponent: () => import('./admin/admin').then(m => m.AdminComponent),
    canActivate: [authGuard], data: { roles: ['ADMIN'] } },
];
