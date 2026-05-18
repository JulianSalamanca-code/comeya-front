import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login',     loadComponent: () => import('./login/login').then(m => m.LoginComponent) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent) },
  { path: 'admin',     loadComponent: () => import('./admin/admin').then(m => m.AdminComponent) },
  { path: 'menu',      loadComponent: () => import('./menu/menu').then(m => m.MenuComponent) },
  { path: 'eventos',   loadComponent: () => import('./eventos/eventos').then(m => m.EventosComponent) },
  { path: 'perfil',    loadComponent: () => import('./perfil/perfil').then(m => m.PerfilComponent) },
  { path: '',          redirectTo: '/login', pathMatch: 'full' }
];
