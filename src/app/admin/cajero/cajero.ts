import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

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

@Component({
  selector: 'app-cajero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cajero.html',
  styleUrl: './cajero.scss'
})
export class CajeroComponent implements OnInit {
  private api = inject(ApiService);
  private isBrowser = typeof window !== 'undefined';

  pedidos = signal<Pedido[]>([]);
  cargando = signal(true);

  totalCobradoHoy = computed(() =>
    this.pedidos()
      .filter(p => p.estado === 'COBRADO')
      .reduce((acc, p) => acc + p.total, 0)
  );

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
          total: p.total || 0,
          estado: MAP_ESTADO[p.status] || p.status || 'PENDIENTE',
          hora: p.createdAt ? new Date(p.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : ''
        })));
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      }
    });
  }

  cobrar(pedido: Pedido) {
    this.api.actualizarEstadoPedido(pedido.id, 'COMPLETED').subscribe({
      next: () => this.marcarCobrado(pedido.id),
      error: () => this.marcarCobrado(pedido.id)
    });
  }

  private marcarCobrado(id: number) {
    this.pedidos.update(list =>
      list.map(p => p.id === id ? { ...p, estado: 'COBRADO' as const } : p)
    );
  }

  get porCobrar() { return this.pedidos().filter(p => p.estado === 'LISTO'); }
  get cobrados()  { return this.pedidos().filter(p => p.estado === 'COBRADO'); }

  formatPrecio(n: number) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
  }

  logout() { this.api.logout(); }
}
