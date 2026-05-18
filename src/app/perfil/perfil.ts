import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class PerfilComponent {
  editando = signal(false);
  guardado = signal(false);

  perfil = {
    nombre: 'Juan Díaz',
    email: 'juan.diaz@uni.edu.co',
    telefono: '300 123 4567',
    programa: 'Ingeniería de Sistemas',
    semestre: '6'
  };

  get iniciales(): string {
    return this.perfil.nombre
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  editar() {
    this.editando.set(true);
    this.guardado.set(false);
  }

  guardar() {
    this.editando.set(false);
    this.guardado.set(true);
    setTimeout(() => this.guardado.set(false), 3000);
  }

  cancelar() {
    this.editando.set(false);
  }
}
