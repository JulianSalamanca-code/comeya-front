import {Component, inject, OnInit, signal, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ApiService } from '../services/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

  private api = inject(ApiService);
  private isBrowser = typeof window !== 'undefined';

  // ───────────────── USER INFO ─────────────────

  username = '';
  rol = '';

  // ───────────────── DATA ─────────────────

  orders = signal<any[]>([]);
  users = signal<any[]>([]);
  recentOrders = signal<any[]>([]);

  // ───────────────── STATS ─────────────────

  totalPedidos = computed(() =>
    this.orders().length
  );

  pedidosPreparacion = computed(() =>
    this.orders()
      .filter(o => o.estado === 'EN_PREPARACION')
      .length
  );

  pedidosListos = computed(() =>
    this.orders()
      .filter(o => o.estado === 'LISTO')
      .length
  );

  totalUsuarios = computed(() =>
    this.users().length
  );

  // ───────────────── ACCESOS ─────────────────

  accesos: any[] = [];

  // ───────────────── EVENTOS ─────────────────

  eventos = signal<any[]>([]);

  // ───────────────── INIT ─────────────────

  ngOnInit(): void {

    this.username =
      this.api.getUsername() || '';

    this.rol =
      this.api.getRol() || '';

    this.cargarAccesos();

    if (this.isBrowser) {
      this.cargarOrders();
      if (this.rol === 'ADMIN') {
        this.cargarUsuarios();
      }
    }

    this.cargarEventos();
  }

  // ───────────────── CARGAR ACCESOS ─────────────────

  cargarAccesos(): void {

    // USER
    if (this.rol === 'USER') {

      this.accesos = [

        {
          label: 'Menú del día',
          icon: '🍱',
          ruta: '/menu',
          desc: 'Ver platos disponibles'
        },

        {
          label: 'Eventos',
          icon: '🎉',
          ruta: '/eventos',
          desc: 'Promociones y novedades'
        },

        {
          label: 'Mi perfil',
          icon: '👤',
          ruta: '/perfil',
          desc: 'Editar información'
        }
      ];
    }

    // STAFF COCINA
    else if (this.rol === 'STAFF_COCINA') {

      this.accesos = [

        {
          label: 'Pedidos',
          icon: '🍳',
          ruta: '/dashboard',
          desc: 'Pedidos en preparación'
        },

        {
          label: 'Pedidos listos',
          icon: '✅',
          ruta: '/dashboard',
          desc: 'Entregar pedidos'
        },

        {
          label: 'Mi perfil',
          icon: '👨‍🍳',
          ruta: '/perfil',
          desc: 'Perfil del cocinero'
        }
      ];
    }

    // STAFF CAJERO
    else if (this.rol === 'STAFF_CAJERO') {

      this.accesos = [

        {
          label: 'Cobros',
          icon: '💳',
          ruta: '/dashboard',
          desc: 'Gestionar pagos'
        },

        {
          label: 'Pedidos',
          icon: '🧾',
          ruta: '/dashboard',
          desc: 'Crear pedidos'
        },

        {
          label: 'Mi perfil',
          icon: '👤',
          ruta: '/perfil',
          desc: 'Perfil del cajero'
        }
      ];
    }

    // ADMIN
    else if (this.rol === 'ADMIN') {

      this.accesos = [

        {
          label: 'Usuarios',
          icon: '👥',
          ruta: '/admin',
          desc: 'Gestión de usuarios'
        },

        {
          label: 'Pedidos',
          icon: '📦',
          ruta: '/dashboard',
          desc: 'Administrar pedidos'
        },

        {
          label: 'Cocina',
          icon: '🍳',
          ruta: '/cocina',
          desc: 'Ver pedidos en cocina'
        },

        {
          label: 'Menú',
          icon: '🍔',
          ruta: '/menu',
          desc: 'Ver menú digital'
        }
      ];
    }
  }

  // ───────────────── PEDIDOS ─────────────────

  cargarOrders(): void {
    if (!this.isBrowser) {
      return;
    }

    this.api.getOrders()
      .subscribe({

        next: (res: any) => {

          this.orders.set(res);

          this.recentOrders.set(
            res.slice(0, 5)
          );
        },

        error: err => {

          console.error(
            'Error cargando pedidos',
            err
          );
        }
      });
  }

  iniciarPreparacion(id: number): void {

    this.api.actualizarEstadoOrder(
      id,
      'EN_PREPARACION'
    ).subscribe(() => {

      this.cargarOrders();
    });
  }

  marcarListo(id: number): void {

    this.api.actualizarEstadoOrder(
      id,
      'LISTO'
    ).subscribe(() => {

      this.cargarOrders();
    });
  }

  // ───────────────── USERS ─────────────────

  cargarUsuarios(): void {

    this.api.getUsers()
      .subscribe({

        next: (res: any) => {

          this.users.set(res);
        },

        error: err => {

          console.error(
            'Error cargando usuarios',
            err
          );
        }
      });
  }

  // ───────────────── EVENTOS ─────────────────

  cargarEventos(): void {

    // luego puedes traer esto del backend

    this.eventos.set([

      {
        titulo: 'Menú especial universitario',
        fecha: 'Hoy',
        desc: 'Almuerzo completo a precio especial'
      },

      {
        titulo: 'Semana gastronómica',
        fecha: 'Esta semana',
        desc: 'Platos típicos colombianos'
      },

      {
        titulo: 'Descuento estudiantes',
        fecha: 'Viernes',
        desc: '20% presentando carnet'
      }
    ]);
  }

  eventosRecientes() {

    return this.eventos();
  }
}
