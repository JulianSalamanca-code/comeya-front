import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private api = inject(ApiService);
  private router = inject(Router);

  email = '';
  contrasena = '';
  cargando = signal(false);
  error = signal('');

  iniciarSesion() {
    if (!this.email || !this.contrasena) {
      this.error.set('Por favor completa todos los campos.');
      return;
    }
    this.error.set('');
    this.cargando.set(true);

    this.api.login(this.email, this.contrasena).subscribe({
      next: (res) => {
        this.cargando.set(false);
        const target = res.role === 'ADMIN' ? '/admin'
          : res.role === 'STAFF_COCINA' ? '/cocina'
          : res.role === 'STAFF_CAJERO' ? '/cajero'
          : '/home';
        this.router.navigate([target]);
      },
      error: (err) => {
        this.cargando.set(false);
        console.error('Login error:', err);
        this.error.set('Correo o contraseña incorrectos.');
      }
    });
  }
}
