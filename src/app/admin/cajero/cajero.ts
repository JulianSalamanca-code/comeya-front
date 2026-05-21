import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

interface Pedido {
  id: number;
  usuario: string;
  items: string[];
  total: number;
  estado: 'LISTO' | 'COBRADO';
  hora: string;
}

@Component({
  selector: 'app-cajero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cajero.html',
  styleUrl: './cajero.scss'
})
export class CajeroComponent implements OnInit {
  private api = inject(ApiService);

  pedidos = signal<Pedido[]>([]);
  cargando = signal(true);

  totalCobradoHoy = computed(() =>
    this.pedidos()
      .filter(p => p.estado === 'COBRADO')
      .reduce((acc, p) => acc + p.total, 0)
  );

  ngOnInit() {
    this.api.getPedidos().subscribe({
      next: (data: any) => {
        this.pedidos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.pedidos.set([
          { id: 3, usuario: 'carlos_r', items: ['Arepa con queso', 'Changua'],    total: 7700,  estado: 'LISTO',   hora: '12:10' },
          { id: 5, usuario: 'pedro_g',  items: ['Bandeja paisa', 'Jugo de lulo'], total: 15300, estado: 'LISTO',   hora: '12:18' },
          { id: 6, usuario: 'laura_m',  items: ['Café tinto', 'Pandebono'],       total: 3300,  estado: 'COBRADO', hora: '12:05' },
          { id: 7, usuario: 'sofia_v',  items: ['Empanada de pipián'],             total: 2200,  estado: 'COBRADO', hora: '11:58' },
        ]);
        this.cargando.set(false);
      }
    });
  }

  cobrar(pedido: Pedido) {
    this.api.actualizarEstadoPedido(pedido.id, 'COBRADO').subscribe({
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
