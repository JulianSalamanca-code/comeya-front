import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  api = inject(ApiService);
  menuAbierto = signal(false);

  get iniciales(): string {
    const name = this.api.getUsername() ?? '';
    return name
      .split(' ')
      .slice(0, 2)
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  }

  toggleMenu() {
    this.menuAbierto.update(v => !v);
  }

  cerrarMenu() {
    this.menuAbierto.set(false);
  }
}

