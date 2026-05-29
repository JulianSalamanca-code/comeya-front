import {Component, inject, OnInit, signal, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api';

const MAP_ESTADO: Record<string, string> = {
  'PENDING': 'PENDIENTE',
  'IN_PROGRESS': 'EN_PREPARACION',
  'COMPLETED': 'LISTO',
  'CANCELLED': 'CANCELADO'
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  private isBrowser = typeof window !== 'undefined';

  username = '';
  rol = '';

  orders = signal<any[]>([]);
  users = signal<any[]>([]);
  recentOrders = signal<any[]>([]);

  totalPedidos = computed(() => this.orders().length);

  pedidosPreparacion = computed(() =>
    this.orders().filter(o => (MAP_ESTADO[o.status] || o.estado) === 'EN_PREPARACION').length
  );

  pedidosListos = computed(() =>
    this.orders().filter(o => (MAP_ESTADO[o.status] || o.estado) === 'LISTO').length
  );

  totalUsuarios = computed(() => {
    const u: any = this.users();
    return u.content?.length ?? u.totalElements ?? u.length ?? 0;
  });

  accesos: any[] = [];
  eventos = signal<any[]>([]);

  ngOnInit(): void {
    this.username = this.api.getUsername() || '';
    this.rol = this.api.getRol() || '';

    this.cargarAccesos();

    if (this.isBrowser) {
      this.cargarOrders();
      if (this.rol === 'ADMIN') {
        this.cargarUsuarios();
      }
    }

    this.cargarEventos();
  }

  cargarAccesos(): void {
    if (this.rol === 'CUSTOMER') {
      this.accesos = [
        { label: 'Menú del día', icon: '🍱', ruta: '/menu', desc: 'Ver platos disponibles' },
        { label: 'Eventos', icon: '🎉', ruta: '/eventos', desc: 'Promociones y novedades' },
        { label: 'Mi perfil', icon: '👤', ruta: '/perfil', desc: 'Editar información' }
      ];
    } else if (this.rol === 'STAFF_COCINA') {
      this.accesos = [
        { label: 'Cocina', icon: '🍳', ruta: '/cocina', desc: 'Pedidos en preparación' },
        { label: 'Perfil', icon: '👨‍🍳', ruta: '/perfil', desc: 'Perfil del cocinero' }
      ];
    } else if (this.rol === 'STAFF_CAJERO') {
      this.accesos = [
        { label: 'Cajero', icon: '💳', ruta: '/cajero', desc: 'Gestionar pagos' },
        { label: 'Perfil', icon: '👤', ruta: '/perfil', desc: 'Perfil del cajero' }
      ];
    } else if (this.rol === 'ADMIN') {
      this.accesos = [
        { label: 'Usuarios', icon: '👥', ruta: '/admin', desc: 'Gestión de usuarios' },
        { label: 'Cocina', icon: '🍳', ruta: '/cocina', desc: 'Ver pedidos en cocina' },
        { label: 'Cajero', icon: '🧾', ruta: '/cajero', desc: 'Ver caja' },
        { label: 'Menú', icon: '🍔', ruta: '/menu', desc: 'Ver menú digital' }
      ];
    }
  }

  cargarOrders(): void {
    if (!this.isBrowser) return;

    this.api.getOrders().subscribe({
      next: (res: any) => {
        this.orders.set(res);
        this.recentOrders.set(res?.slice(0, 5) || []);
      },
      error: () => {}
    });
  }

  iniciarPreparacion(id: number): void {
    this.api.actualizarEstadoOrder(id, 'IN_PROGRESS').subscribe(() => {
      this.cargarOrders();
    });
  }

  marcarListo(id: number): void {
    this.api.actualizarEstadoOrder(id, 'COMPLETED').subscribe(() => {
      this.cargarOrders();
    });
  }

  cargarUsuarios(): void {
    this.api.getUsers().subscribe({
      next: (res: any) => this.users.set(res),
      error: () => {}
    });
  }

  cargarEventos(): void {
    this.eventos.set([
      { titulo: 'Menú especial universitario', fecha: 'Hoy', desc: 'Almuerzo completo a precio especial' },
      { titulo: 'Semana gastronómica', fecha: 'Esta semana', desc: 'Platos típicos colombianos' },
      { titulo: 'Descuento estudiantes', fecha: 'Viernes', desc: '20% presentando carnet' }
    ]);
  }

  eventosRecientes() {
    return this.eventos();
  }
}
