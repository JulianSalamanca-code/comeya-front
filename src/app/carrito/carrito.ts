import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  cart = signal<CartItem[]>(this.loadCart());

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
    // TODO: integrar con API
    const totalItems = this.totalItems;
    this.cart.set([]);
    this.save();
    alert('✅ Pedido enviado a cocina (' + totalItems + ' productos)');
  }
}
