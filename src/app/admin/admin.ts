import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {
  private api = inject(ApiService);

  usuarios = signal<Usuario[]>([]);
  cargando = signal(true);

  ngOnInit() {
    this.api.getUsers().subscribe({
      next: (data: any) => {
        this.usuarios.set(data);
        this.cargando.set(false);
      },
      error: () => {
        // Placeholder si el backend no responde aún
        this.usuarios.set([
          { id: 1, nombre: 'Juan Díaz', email: 'juan.diaz@uni.edu.co', rol: 'Estudiante', activo: true },
          { id: 2, nombre: 'María López', email: 'maria.lopez@uni.edu.co', rol: 'Docente', activo: true },
          { id: 3, nombre: 'Carlos Ruiz', email: 'carlos.ruiz@uni.edu.co', rol: 'Admin', activo: false },
          { id: 4, nombre: 'Ana Torres', email: 'ana.torres@uni.edu.co', rol: 'Estudiante', activo: true },
          { id: 5, nombre: 'Pedro Gómez', email: 'pedro.gomez@uni.edu.co', rol: 'Estudiante', activo: false },
        ]);
        this.cargando.set(false);
      }
    });
  }

  toggleEstado(usuario: Usuario) {
    this.usuarios.update(list =>
      list.map(u => u.id === usuario.id ? { ...u, activo: !u.activo } : u)
    );
  }
}
