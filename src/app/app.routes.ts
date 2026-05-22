import { Routes } from '@angular/router';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'login',
    loadComponent: () => import('./login/login').then(m => m.LoginComponent) },

  {
    path: '',
    loadComponent: () => import('./shell/shell').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      { path: 'home',
        loadComponent: () => import('./home/home').then(m => m.HomeComponent) },
      { path: 'menu',
        loadComponent: () => import('./menu/menu').then(m => m.MenuComponent) },
      { path: 'carrito',
        loadComponent: () => import('./carrito/carrito').then(m => m.CartComponent) },
      { path: 'pedidos',
        loadComponent: () => import('./pedidos/pedidos').then(m => m.PedidosComponent) },
      { path: 'perfil',
        loadComponent: () => import('./perfil/perfil').then(m => m.PerfilComponent) },
      { path: 'eventos',
        loadComponent: () => import('./eventos/eventos').then(m => m.EventosComponent) },
    ]
  },

  { path: 'cocina',
    loadComponent: () => import('./admin/cocina/cocina').then(m => m.CocinaComponent),
    canActivate: [authGuard], data: { roles: ['STAFF_COCINA', 'ADMIN'] } },

  { path: 'cajero',
    loadComponent: () => import('./admin/cajero/cajero').then(m => m.CajeroComponent),
    canActivate: [authGuard], data: { roles: ['STAFF_CAJERO', 'ADMIN'] } },

  { path: 'admin',
    loadComponent: () => import('./admin/admin').then(m => m.AdminComponent),
    canActivate: [authGuard], data: { roles: ['ADMIN'] } },

  { path: '**', redirectTo: 'home' },
];
