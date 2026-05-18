import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private api = inject(ApiService);
  private router = inject(Router);

  usuario = '';
  contrasena = '';
  cargando = signal(false);
  error = signal('');

  iniciarSesion() {
  if (!this.usuario || !this.contrasena) {
    this.error.set('Por favor completa todos los campos.');
    return;
  }
  // Bypass temporal sin backend
  this.router.navigate(['/dashboard']);

  };
}
