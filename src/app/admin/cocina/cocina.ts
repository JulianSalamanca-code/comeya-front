import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

interface Pedido {
  id: number;
  usuario: string;
  items: string[];
  estado: 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO';
  hora: string;
}

@Component({
  selector: 'app-cocina',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cocina.html',
  styleUrl: './cocina.scss'
})
export class CocinaComponent implements OnInit {
  private api = inject(ApiService);

  pedidos = signal<Pedido[]>([]);
  cargando = signal(true);

  ngOnInit() {
    this.api.getPedidos().subscribe({
      next: (data: any) => {
        this.pedidos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        // Datos de prueba mientras el backend responde
        this.pedidos.set([
          { id: 1, usuario: 'juan123',  items: ['Bandeja paisa', 'Jugo de lulo'], estado: 'PENDIENTE',      hora: '12:03' },
          { id: 2, usuario: 'maria99',  items: ['Ajiaco', 'Café tinto'],          estado: 'EN_PREPARACION', hora: '12:07' },
          { id: 3, usuario: 'carlos_r', items: ['Arepa con queso', 'Changua'],    estado: 'LISTO',          hora: '12:10' },
          { id: 4, usuario: 'ana_t',    items: ['Empanada de pipián'],             estado: 'PENDIENTE',      hora: '12:15' },
        ]);
        this.cargando.set(false);
      }
    });
  }

  avanzarEstado(pedido: Pedido) {
    const siguiente: Record<string, 'EN_PREPARACION' | 'LISTO'> = {
      'PENDIENTE':      'EN_PREPARACION',
      'EN_PREPARACION': 'LISTO'
    };
    if (!siguiente[pedido.estado]) return;

    const nuevoEstado = siguiente[pedido.estado];
    this.api.actualizarEstadoPedido(pedido.id, nuevoEstado).subscribe({
      next: () => this.actualizarLocal(pedido.id, nuevoEstado),
      error: () => this.actualizarLocal(pedido.id, nuevoEstado) // actualiza local igual
    });
  }

  private actualizarLocal(id: number, estado: 'EN_PREPARACION' | 'LISTO') {
    this.pedidos.update(list =>
      list.map(p => p.id === id ? { ...p, estado } : p)
    );
  }

  get pendientes()     { return this.pedidos().filter(p => p.estado === 'PENDIENTE'); }
  get enPreparacion()  { return this.pedidos().filter(p => p.estado === 'EN_PREPARACION'); }
  get listos()         { return this.pedidos().filter(p => p.estado === 'LISTO'); }

  logout() { this.api.logout(); }
}
