import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPasswordComponent {
  private api = inject(ApiService);

  step = signal<'email' | 'token'>('email');

  email = '';
  token = '';
  newPassword = '';

  cargando = signal(false);
  error = signal('');
  exito = signal('');

  solicitarToken() {
    if (!this.email) {
      this.error.set('Ingresa tu correo electrónico.');
      return;
    }
    this.error.set('');
    this.cargando.set(true);

    this.api.forgotPassword(this.email).subscribe({
      next: (token: string) => {
        this.cargando.set(false);
        if (token) {
          this.token = token;
          this.exito.set(`Token generado: ${token}. Se ha autocompletado el campo.`);
        } else {
          this.exito.set('Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.');
        }
        this.step.set('token');
      },
      error: () => {
        this.cargando.set(false);
        this.exito.set('Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.');
        this.step.set('token');
      }
    });
  }

  restablecer() {
    if (!this.token || !this.newPassword) {
      this.error.set('Completa todos los campos.');
      return;
    }
    if (this.newPassword.length < 8) {
      this.error.set('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    this.error.set('');
    this.cargando.set(true);

    this.api.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.cargando.set(false);
        this.exito.set('Contraseña restablecida correctamente. Ya puedes iniciar sesión.');
        this.step.set('email');
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('El token es inválido o ha expirado. Solicita uno nuevo.');
      }
    });
  }
}
