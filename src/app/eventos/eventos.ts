import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventos.html',
  styleUrl: './eventos.scss'
})
export class EventosComponent {
  eventos = [
    { titulo: 'Waffle Fest', desc: 'Todos los viernes: waffles con toppings especiales a precio especial.', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80' },
    { titulo: 'Happy Coffee', desc: 'Lunes y miércoles: 2x1 en todas las bebidas calientes de 7am a 10am.', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80' },
    { titulo: 'Menú Ejecutivo', desc: 'Almuerzo completo por $12,000. Incluye sopa, plato fuerte y bebida.', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80' },
  ];
}
