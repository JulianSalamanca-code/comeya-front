import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface LoginResponse {
  token: string;
  rol: 'USER' | 'STAFF_COCINA' | 'STAFF_CAJERO' | 'ADMIN';
  username: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private base = 'http://localhost:8080/api';

  // ─── AUTH ───────────────────────────────────────────
  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, { username, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('rol',   res.rol);
        localStorage.setItem('username', res.username);
      })
    );
  }

  register(data: { nombreCompleto: string; username: string; email: string; password: string }) {
    return this.http.post(`${this.base}/auth/register`, data);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // ─── HELPERS ────────────────────────────────────────
  getToken():    string | null { return localStorage.getItem('token'); }
  getRol():      string | null { return localStorage.getItem('rol'); }
  getUsername(): string | null { return localStorage.getItem('username'); }
  isLoggedIn():  boolean       { return !!this.getToken(); }

  // ─── USUARIOS (ADMIN) ────────────────────────────────
  getUsers() {
    return this.http.get(`${this.base}/users`);
  }

  updateRol(userId: number, rol: string) {
    return this.http.put(`${this.base}/users/${userId}/rol`, { rol });
  }

  // ─── PEDIDOS ─────────────────────────────────────────
  getPedidos() {
    return this.http.get(`${this.base}/pedidos`);
  }

  crearPedido(pedido: any) {
    return this.http.post(`${this.base}/pedidos`, pedido);
  }

  actualizarEstadoPedido(id: number, estado: string) {
    return this.http.put(`${this.base}/pedidos/${id}`, { estado });
  }
}
