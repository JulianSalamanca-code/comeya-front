import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api';
import { ProductosComponent } from './productos/productos';
import { CafeteriasComponent } from './cafeterias/cafeterias';

interface Usuario {
  id: number;
  fullName: string;
  email: string;
  role: string;
  active: boolean;
}

interface Pedido {
  id: number;
  usuario: string;
  items: string[];
  total: number;
  estado: string;
  hora: string;
}

const MAP_ESTADO: Record<string, string> = {
  'PENDING': 'PENDIENTE',
  'IN_PROGRESS': 'EN_PREPARACION',
  'COMPLETED': 'LISTO',
  'CANCELLED': 'CANCELADO'
};

const MAP_ESTADO_REV: Record<string, string> = {
  'PENDIENTE': 'PENDING',
  'EN_PREPARACION': 'IN_PROGRESS',
  'LISTO': 'COMPLETED'
};

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ProductosComponent, CafeteriasComponent],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {
  private api = inject(ApiService);
  private isBrowser = typeof window !== 'undefined';

  usuarios = signal<Usuario[]>([]);
  cargandoUsers = signal(true);

  pedidos = signal<Pedido[]>([]);
  cargandoPedidos = signal(true);

  tab = signal<'cocina' | 'caja' | 'usuarios' | 'productos' | 'cafeterias'>('cocina');

  totalCobradoHoy = computed(() =>
    this.pedidos().filter(p => p.estado === 'COBRADO').reduce((acc, p) => acc + p.total, 0)
  );

  get pendientes()    { return this.pedidos().filter(p => p.estado === 'PENDIENTE'); }
  get enPreparacion() { return this.pedidos().filter(p => p.estado === 'EN_PREPARACION'); }
  get listos()        { return this.pedidos().filter(p => p.estado === 'LISTO'); }
  get porCobrar()     { return this.pedidos().filter(p => p.estado === 'LISTO'); }
  get cobrados()      { return this.pedidos().filter(p => p.estado === 'COBRADO'); }

  ngOnInit() {
    if (!this.isBrowser) return;

    this.api.getUsers().subscribe({
      next: (data: any) => {
        const list = data?.content || data || [];
        this.usuarios.set(list.map((u: any) => ({
          id: u.id,
          fullName: u.name || u.fullName,
          email: u.email,
          role: u.role,
          active: u.active
        })));
        this.cargandoUsers.set(false);
      },
      error: () => {
        this.cargandoUsers.set(false);
      }
    });

    this.api.getPedidos().subscribe({
      next: (data: any) => {
        this.pedidos.set((data || []).map((p: any) => ({
          id: p.id,
          usuario: p.client || p.customerName || 'Desconocido',
          items: p.items?.map((i: any) => i.productName || 'Producto') || [],
          total: p.total || 0,
          estado: MAP_ESTADO[p.status] || p.status || 'PENDIENTE',
          hora: p.createdAt ? new Date(p.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : ''
        })));
        this.cargandoPedidos.set(false);
      },
      error: () => {
        this.cargandoPedidos.set(false);
      }
    });
  }

  avanzarEstado(pedido: Pedido) {
    const siguiente: Record<string, string> = {
      'PENDIENTE': 'EN_PREPARACION',
      'EN_PREPARACION': 'LISTO'
    };
    if (!siguiente[pedido.estado]) return;
    const nuevoEstado = siguiente[pedido.estado];
    this.api.actualizarEstadoPedido(pedido.id, MAP_ESTADO_REV[nuevoEstado]).subscribe({
      next: () => this.actualizarPedidoLocal(pedido.id, nuevoEstado),
      error: () => this.actualizarPedidoLocal(pedido.id, nuevoEstado)
    });
  }

  cobrar(pedido: Pedido) {
    this.api.actualizarEstadoPedido(pedido.id, 'COMPLETED').subscribe({
      next: () => this.actualizarPedidoLocal(pedido.id, 'COBRADO'),
      error: () => this.actualizarPedidoLocal(pedido.id, 'COBRADO')
    });
  }

  private actualizarPedidoLocal(id: number, estado: string) {
    this.pedidos.update(list => list.map(p => p.id === id ? { ...p, estado } : p));
  }

  toggleEstado(usuario: Usuario) {
    this.usuarios.update(list =>
      list.map(u => u.id === usuario.id ? { ...u, active: !u.active } : u)
    );
  }

  formatPrecio(n: number) {
    return '$' + n.toLocaleString('es-CO');
  }

  logout() { this.api.logout(); }
}
