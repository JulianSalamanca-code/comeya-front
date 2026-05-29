import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api';

interface Producto {
  id: number;
  name: string;
  price: number;
  description?: string;
  type?: string;
  image?: string;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class MenuComponent implements OnInit {
  private api = inject(ApiService);
  private isBrowser = typeof window !== 'undefined';

  productos = signal<Producto[]>([]);
  cargando = signal(true);
  categoriaActiva = signal('Todos');

  categorias = computed(() => {
    const cats = new Set(this.productos().map(p => p.type || 'General'));
    return ['Todos', ...cats];
  });

  productosFiltrados = computed(() => {
    const cat = this.categoriaActiva();
    return cat === 'Todos'
      ? this.productos()
      : this.productos().filter(p => p.type === cat);
  });

  ngOnInit() {
    if (!this.isBrowser) {
      this.cargando.set(false);
      return;
    }

    this.api.getProducts().subscribe({
      next: (data: any) => {
        this.productos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      }
    });
  }

  setCategoria(cat: string) {
    this.categoriaActiva.set(cat);
  }

  addToCart(producto: Producto) {
    if (typeof window === 'undefined') return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((i: any) => i.id === producto.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: producto.id, nombre: producto.name, precio: producto.price, img: producto.image || '', qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  formatPrecio(precio: number): string {
    return '$' + precio.toLocaleString('es-CO');
  }
}
