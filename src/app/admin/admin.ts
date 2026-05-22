import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api';

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

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {
  private api = inject(ApiService);
  private isBrowser = typeof window !== 'undefined';

  // Users
  usuarios = signal<Usuario[]>([]);
  cargandoUsers = signal(true);

  // Cocina
  pedidos = signal<Pedido[]>([]);
  cargandoPedidos = signal(true);

  // Cajero
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
      next: (data: any) => { this.usuarios.set(data); this.cargandoUsers.set(false); },
      error: () => {
        this.usuarios.set([
          { id: 1, fullName: 'Juan Díaz', email: 'juan.diaz@uni.edu.co', role: 'USER', active: true },
          { id: 2, fullName: 'María López', email: 'maria.lopez@uni.edu.co', role: 'USER', active: true },
          { id: 3, fullName: 'Carlos Ruiz', email: 'carlos.ruiz@uni.edu.co', role: 'ADMIN', active: false },
          { id: 4, fullName: 'Ana Torres', email: 'ana.torres@uni.edu.co', role: 'USER', active: true },
        ]);
        this.cargandoUsers.set(false);
      }
    });

    this.api.getPedidos().subscribe({
      next: (data: any) => { this.pedidos.set(data); this.cargandoPedidos.set(false); },
      error: () => {
        this.pedidos.set([
          { id: 1, usuario: 'juan123',  items: ['Bandeja paisa', 'Jugo de lulo'], total: 12500, estado: 'PENDIENTE',      hora: '12:03' },
          { id: 2, usuario: 'maria99',  items: ['Ajiaco', 'Café tinto'],          total: 11300, estado: 'EN_PREPARACION', hora: '12:07' },
          { id: 3, usuario: 'carlos_r', items: ['Arepa con queso', 'Changua'],    total: 7700,  estado: 'LISTO',          hora: '12:10' },
          { id: 4, usuario: 'ana_t',    items: ['Empanada de pipián'],             total: 2200,  estado: 'PENDIENTE',      hora: '12:15' },
          { id: 6, usuario: 'laura_m',  items: ['Café tinto', 'Pandebono'],       total: 3300,  estado: 'COBRADO',        hora: '12:05' },
          { id: 7, usuario: 'sofia_v',  items: ['Empanada de pipián'],             total: 2200,  estado: 'COBRADO',        hora: '11:58' },
        ]);
        this.cargandoPedidos.set(false);
      }
    });
  }

  // ── Cocina actions ──
  avanzarEstado(pedido: Pedido) {
    const siguiente: Record<string, string> = {
      'PENDIENTE': 'EN_PREPARACION',
      'EN_PREPARACION': 'LISTO'
    };
    if (!siguiente[pedido.estado]) return;
    this.api.actualizarEstadoPedido(pedido.id, siguiente[pedido.estado]).subscribe({
      next: () => this.actualizarPedidoLocal(pedido.id, siguiente[pedido.estado]),
      error: () => this.actualizarPedidoLocal(pedido.id, siguiente[pedido.estado])
    });
  }

  // ── Cajero actions ──
  cobrar(pedido: Pedido) {
    this.api.actualizarEstadoPedido(pedido.id, 'COBRADO').subscribe({
      next: () => this.actualizarPedidoLocal(pedido.id, 'COBRADO'),
      error: () => this.actualizarPedidoLocal(pedido.id, 'COBRADO')
    });
  }

  private actualizarPedidoLocal(id: number, estado: string) {
    this.pedidos.update(list => list.map(p => p.id === id ? { ...p, estado } : p));
  }

  // ── User actions ──
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
