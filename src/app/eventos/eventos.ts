import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Evento {
  titulo: string;
  descripcion: string;
  fecha: string;
  emoji: string;
  tipo: string;
}

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventos.html',
  styleUrl: './eventos.scss'
})
export class EventosComponent {
  eventos = signal<Evento[]>([
    { titulo: 'Semana Gastronómica', descripcion: 'Platos típicos colombianos a precio especial durante toda la semana.', fecha: '19 - 23 May', emoji: '🇨🇴', tipo: 'Evento' },
    { titulo: '2x1 en Jugos', descripcion: 'Lleva dos jugos naturales por el precio de uno todos los miércoles.', fecha: 'Cada miércoles', emoji: '🥤', tipo: 'Promoción' },
    { titulo: 'Menú Vegetariano', descripcion: 'Nueva línea de platos vegetarianos disponibles a partir de esta semana.', fecha: 'Permanente', emoji: '🥗', tipo: 'Nuevo' },
    { titulo: 'Descuento Carnet', descripcion: '20% de descuento presentando tu carnet universitario vigente.', fecha: 'Todo el mes', emoji: '🎓', tipo: 'Promoción' },
    { titulo: 'Almuerzo Ejecutivo', descripcion: 'Sopa + plato fuerte + jugo + postre por $15.000.', fecha: 'Lunes a viernes', emoji: '🍱', tipo: 'Especial' },
    { titulo: 'Taller de Cocina', descripcion: 'Únete al taller de cocina saludable organizado por Bienestar Universitario.', fecha: '28 May', emoji: '👨‍🍳', tipo: 'Evento' },
  ]);
}
