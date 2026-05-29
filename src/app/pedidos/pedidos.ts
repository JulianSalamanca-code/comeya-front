import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api';

const MAP_ESTADO: Record<string, string> = {
  'PENDING': 'NUEVO',
  'IN_PROGRESS': 'PREPARANDO',
  'COMPLETED': 'LISTO',
  'CANCELLED': 'CANCELADO'
};

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.scss'
})
export class PedidosComponent implements OnInit {
  private api = inject(ApiService);
  private isBrowser = typeof window !== 'undefined';

  pedidos = signal<any[]>([]);
  cargando = signal(true);

  statusLabel: Record<string, string> = {
    NUEVO: 'Nuevo',
    PREPARANDO: 'En preparación',
    LISTO: 'Listo',
    CANCELADO: 'Cancelado',
  };

  statusClass: Record<string, string> = {
    NUEVO: 'status-nuevo',
    PREPARANDO: 'status-preparando',
    LISTO: 'status-listo',
    CANCELADO: 'status-cancelado',
  };

  ngOnInit() {
    if (!this.isBrowser) {
      this.cargando.set(false);
      return;
    }

    this.api.getOrders().subscribe({
      next: (data: any) => {
        this.pedidos.set((data || []).map((p: any) => ({
          id: `#${p.id}`,
          mesa: p.cafeteria?.name || 'Para llevar',
          estado: MAP_ESTADO[p.status] || p.status || 'NUEVO',
          hora: p.createdAt ? new Date(p.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : '',
          items: p.items?.map((i: any) => `${i.quantity}x ${i.productName || 'Producto'}`) || [],
          total: p.total || 0
        })));
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      }
    });
  }

  formatPrecio(p: number): string {
    return '$' + p.toLocaleString('es-CO');
  }
}
