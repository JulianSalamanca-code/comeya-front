import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private api = inject(ApiService);
  private router = inject(Router);

  tabActivo: 'login' | 'registro' = 'login';

  // Login
  usuario = '';
  contrasena = '';
  cargando = signal(false);
  error = signal('');

  // Registro
  regNombre = '';
  regEmail = '';
  regUsuario = '';
  regContrasena = '';
  errorReg = signal('');
  exitoReg = signal('');

  iniciarSesion() {
    if (!this.usuario || !this.contrasena) {
      this.error.set('Por favor completa todos los campos.');
      return;
    }
    this.error.set('');
    this.cargando.set(true);

    this.api.login(this.usuario, this.contrasena).subscribe({
      next: (res) => {
        this.cargando.set(false);
        const target = res.rol === 'STAFF_COCINA' ? '/cocina'
          : res.rol === 'STAFF_CAJERO' ? '/cajero'
          : '/home';
        this.router.navigate([target]);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('Usuario o contraseña incorrectos.');
      }
    });
  }

  registrar() {
    if (!this.regNombre || !this.regEmail || !this.regUsuario || !this.regContrasena) {
      this.errorReg.set('Por favor completa todos los campos.');
      return;
    }
    if (this.regContrasena.length < 6) {
      this.errorReg.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    this.errorReg.set('');
    this.cargando.set(true);

    this.api.register({
      fullName: this.regNombre,
      username: this.regUsuario,
      email: this.regEmail,
      password: this.regContrasena
    }).subscribe({
      next: () => {
        this.cargando.set(false);
        this.exitoReg.set('¡Cuenta creada! Ya puedes iniciar sesión.');
        setTimeout(() => {
          this.tabActivo = 'login';
          this.exitoReg.set('');
        }, 2000);
      },
      error: () => {
        this.cargando.set(false);
        this.errorReg.set('Error al registrar. El usuario o email ya existe.');
      }
    });
  }
}
