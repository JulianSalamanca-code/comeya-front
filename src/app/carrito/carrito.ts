import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api';

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  img: string;
  qty: number;
}

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.scss'
})
export class CartComponent {
  private api = inject(ApiService);
  private router = inject(Router);

  cart = signal<CartItem[]>(this.loadCart());
  cargando = signal(false);
  error = signal('');

  private loadCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  }

  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(this.cart()));
    }
  }

  get subtotal(): number {
    return this.cart().reduce((s, i) => s + i.precio * i.qty, 0);
  }

  get delivery(): number {
    return 1500;
  }

  get total(): number {
    return this.subtotal + this.delivery;
  }

  get totalItems(): number {
    return this.cart().reduce((s, i) => s + i.qty, 0);
  }

  changeQty(idx: number, delta: number) {
    this.cart.update(list => {
      const item = list[idx];
      if (!item) return list;
      item.qty += delta;
      if (item.qty <= 0) list.splice(idx, 1);
      return [...list];
    });
    this.save();
  }

  formatPrecio(p: number): string {
    return '$' + p.toLocaleString('es-CO');
  }

  realizarPedido() {
    const items = this.cart();
    if (items.length === 0) return;

    this.cargando.set(true);
    this.error.set('');

    this.api.getCafeterias().subscribe({
      next: (cafeterias: any) => {
        const cafeteriaId = Array.isArray(cafeterias) && cafeterias.length > 0 ? cafeterias[0].id : 1;

        const order = {
          cafeteriaId,
          items: items.map(i => ({
            productId: i.id,
            quantity: i.qty
          }))
        };

        this.api.crearOrder(order).subscribe({
          next: () => {
            this.cargando.set(false);
            this.cart.set([]);
            this.save();
            this.router.navigate(['/pedidos']);
          },
          error: () => {
            this.cargando.set(false);
            this.error.set('Error al crear el pedido. Intenta de nuevo.');
          }
        });
      },
      error: () => {
        const order = {
          cafeteriaId: 1,
          items: items.map(i => ({
            productId: i.id,
            quantity: i.qty
          }))
        };

        this.api.crearOrder(order).subscribe({
          next: () => {
            this.cargando.set(false);
            this.cart.set([]);
            this.save();
            this.router.navigate(['/pedidos']);
          },
          error: () => {
            this.cargando.set(false);
            this.error.set('Error al crear el pedido. Intenta de nuevo.');
          }
        });
      }
    });
  }
}
