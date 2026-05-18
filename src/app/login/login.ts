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
  regSemestre = '';
  errorReg = signal('');
  exitoReg = signal('');

  iniciarSesion() {
    if (!this.usuario || !this.contrasena) {
      this.error.set('Por favor completa todos los campos.');
      return;
    }
    // Bypass temporal — reemplazar con this.api.login() cuando el backend esté listo
    this.router.navigate(['/dashboard']);
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

    // Simulación — conectar con backend cuando esté listo
    setTimeout(() => {
      this.cargando.set(false);
      this.exitoReg.set('¡Cuenta creada! Ya puedes iniciar sesión.');
      setTimeout(() => {
        this.tabActivo = 'login';
        this.exitoReg.set('');
      }, 2000);
    }, 1000);
  }
}
