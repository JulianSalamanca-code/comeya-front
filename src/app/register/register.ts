import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  private api = inject(ApiService);
  private router = inject(Router);

  nombre = '';
  email = '';
  contrasena = '';
  cargando = signal(false);
  error = signal('');
  exito = signal('');

  registrar() {
    if (!this.nombre || !this.email || !this.contrasena) {
      this.error.set('Por favor completa todos los campos.');
      return;
    }
    if (this.contrasena.length < 6) {
      this.error.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    this.error.set('');
    this.cargando.set(true);

    this.api.register({
      name: this.nombre,
      email: this.email,
      password: this.contrasena
    }).subscribe({
      next: () => {
        this.cargando.set(false);
        this.exito.set('¡Cuenta creada! Ya puedes iniciar sesión.');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('Error al registrar. El correo ya existe.');
      }
    });
  }
}
