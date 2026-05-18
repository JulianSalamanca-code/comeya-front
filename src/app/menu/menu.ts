import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Plato {
  nombre: string;
  precio: number;
  desc: string;
  emoji: string;
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
  categorias = ['Todos', 'Desayuno', 'Almuerzo', 'Bebidas', 'Snacks'];
  categoriaActiva = signal('Todos');

  platos: Plato[] = [
    { nombre: 'Bandeja paisa', precio: 12500, desc: 'Frijoles, arroz, chicharrón, huevo y más', emoji: '🍛', categoria: 'Almuerzo' },
    { nombre: 'Ajiaco bogotano', precio: 9800, desc: 'Sopa tradicional con papa, pollo y guascas', emoji: '🍲', categoria: 'Almuerzo' },
    { nombre: 'Arepa con queso', precio: 3500, desc: 'Arepa de choclo con queso campesino', emoji: '🫓', categoria: 'Desayuno' },
    { nombre: 'Changua', precio: 4200, desc: 'Sopa de leche con huevo y cilantro', emoji: '🥣', categoria: 'Desayuno' },
    { nombre: 'Jugo de lulo', precio: 2800, desc: 'Lulo natural con leche o agua', emoji: '🥤', categoria: 'Bebidas' },
    { nombre: 'Café tinto', precio: 1500, desc: 'Café colombiano puro', emoji: '☕', categoria: 'Bebidas' },
    { nombre: 'Empanada de pipián', precio: 2200, desc: 'Empanada rellena con papa y maní', emoji: '🥟', categoria: 'Snacks' },
    { nombre: 'Pandebono', precio: 1800, desc: 'Pan de queso tradicional valluno', emoji: '🧀', categoria: 'Snacks' },
  ];

  get platosFiltrados(): Plato[] {
    const cat = this.categoriaActiva();
    return cat === 'Todos' ? this.platos : this.platos.filter(p => p.categoria === cat);
  }

  setCategoria(cat: string) {
    this.categoriaActiva.set(cat);
  }

  formatPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(precio);
  }
}
