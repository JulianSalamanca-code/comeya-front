import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

interface Pedido {
  id: number;
  usuario: string;
  items: string[];
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
  selector: 'app-cocina',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cocina.html',
  styleUrl: './cocina.scss'
})
export class CocinaComponent implements OnInit {
  private api = inject(ApiService);
  private isBrowser = typeof window !== 'undefined';

  pedidos = signal<Pedido[]>([]);
  cargando = signal(true);

  ngOnInit() {
    if (!this.isBrowser) {
      this.cargando.set(false);
      return;
    }

    this.api.getPedidos().subscribe({
      next: (data: any) => {
        this.pedidos.set((data || []).map((p: any) => ({
          id: p.id,
          usuario: p.client || p.customerName || 'Desconocido',
          items: p.items?.map((i: any) => i.productName || 'Producto') || [],
          estado: MAP_ESTADO[p.status] || p.status,
          hora: p.createdAt ? new Date(p.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : ''
        })));
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
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
      next: () => this.actualizarLocal(pedido.id, nuevoEstado),
      error: () => this.actualizarLocal(pedido.id, nuevoEstado)
    });
  }

  private actualizarLocal(id: number, estado: string) {
    this.pedidos.update(list =>
      list.map(p => p.id === id ? { ...p, estado } : p)
    );
  }

  get pendientes()     { return this.pedidos().filter(p => p.estado === 'PENDIENTE'); }
  get enPreparacion()  { return this.pedidos().filter(p => p.estado === 'EN_PREPARACION'); }
  get listos()         { return this.pedidos().filter(p => p.estado === 'LISTO'); }

  logout() { this.api.logout(); }
}
