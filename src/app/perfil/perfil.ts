import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class PerfilComponent implements OnInit {
  api = inject(ApiService);

  perfil: any = { nombre: 'Usuario', email: '' };
  rol = '';

  ngOnInit() {
    this.rol = this.api.getRol() ?? '';
    const username = this.api.getUsername() ?? 'Usuario';
    this.perfil = { nombre: username, email: '' };

    if (typeof window !== 'undefined') {
      this.api.getMe().subscribe({
        next: (res: any) => {
          this.perfil = res;
        },
        error: () => {}
      });
    }
  }

  logout() {
    this.api.logout();
  }
}
