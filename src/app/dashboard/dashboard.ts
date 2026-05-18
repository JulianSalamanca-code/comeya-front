import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);

  accesos = [
    { label: 'Menú del día', icon: '🍱', ruta: '/menu', desc: 'Ver platos disponibles hoy' },
    { label: 'Eventos', icon: '🎉', ruta: '/eventos', desc: 'Promociones y novedades' },
    { label: 'Mi perfil', icon: '👤', ruta: '/perfil', desc: 'Editar tu información' },
    { label: 'Administración', icon: '⚙️', ruta: '/admin', desc: 'Gestión de usuarios' },
  ];

  eventosRecientes = signal<any[]>([]);

  ngOnInit() {
    // Placeholder — en producción vendría del backend
    this.eventosRecientes.set([
      { titulo: 'Menú especial universitario', fecha: 'Hoy', desc: 'Almuerzo completo a precio especial' },
      { titulo: 'Semana de la gastronomía', fecha: 'Esta semana', desc: 'Platos típicos colombianos' },
      { titulo: 'Descuento para estudiantes', fecha: 'Viernes', desc: '20% de descuento presentando carnet' },
    ]);
  }
}
