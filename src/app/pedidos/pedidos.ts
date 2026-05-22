import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Pedido {
  id: string;
  mesa: string;
  estado: string;
  hora: string;
  items: string[];
  total: number;
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.scss'
})
export class PedidosComponent {
  pedidos: Pedido[] = [
    { id: '#1024', mesa: 'Mesa 5', estado: 'PREPARANDO', hora: '12:43 PM', items: ['1x Ensalada César', '1x Jugo Natural', '1x Café Americano'], total: 9500 },
    { id: '#1020', mesa: 'Para llevar', estado: 'ENTREGADO', hora: '11:15 AM', items: ['2x Hamburguesa Clásica', '2x Coca Cola'], total: 23000 },
  ];

  statusLabel: Record<string, string> = {
    NUEVO: 'Nuevo',
    PREPARANDO: 'En preparación',
    LISTO: 'Listo',
    ENTREGADO: 'Entregado',
  };

  statusClass: Record<string, string> = {
    NUEVO: 'status-nuevo',
    PREPARANDO: 'status-preparando',
    LISTO: 'status-listo',
    ENTREGADO: 'status-entregado',
  };

  formatPrecio(p: number): string {
    return '$' + p.toLocaleString('es-CO');
  }
}
