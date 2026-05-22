import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Plato {
  id: number;
  nombre: string;
  precio: number;
  desc: string;
  img: string;
  categoria: string;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class MenuComponent {
  categorias = ['Todos', 'Platos', 'Ensaladas', 'Postres'];
  categoriaActiva = signal('Todos');

  platos: Plato[] = [
    { id: 1, nombre: 'Hamburguesa Clásica', precio: 8500, desc: 'Con papas fritas', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80', categoria: 'Platos' },
    { id: 2, nombre: 'Club Sándwich', precio: 7000, desc: 'Con tomate y lechuga', img: 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=300&q=80', categoria: 'Platos' },
    { id: 3, nombre: 'Pizza Pepperoni', precio: 9500, desc: 'Extra queso', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80', categoria: 'Platos' },
    { id: 4, nombre: 'Ensalada César', precio: 6000, desc: 'Sin crutones', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80', categoria: 'Ensaladas' },
    { id: 5, nombre: 'Bowl de Açaí', precio: 7500, desc: 'Con granola y frutas', img: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300&q=80', categoria: 'Postres' },
    { id: 6, nombre: 'Waffle con Helado', precio: 8000, desc: 'Chocolate y vainilla', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&q=80', categoria: 'Postres' },
    { id: 10, nombre: 'Café Americano', precio: 3000, desc: 'Grano colombiano', img: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=300&q=80', categoria: 'Bebidas' },
    { id: 11, nombre: 'Jugo Natural', precio: 3500, desc: 'Naranja o Maracuyá', img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&q=80', categoria: 'Bebidas' },
  ];

  get platosFiltrados(): Plato[] {
    const cat = this.categoriaActiva();
    return cat === 'Todos' ? this.platos : this.platos.filter(p => p.categoria === cat);
  }

  setCategoria(cat: string) {
    this.categoriaActiva.set(cat);
  }

  formatPrecio(precio: number): string {
    return '$' + precio.toLocaleString('es-CO');
  }
}
