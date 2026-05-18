import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/api';

  getUsers() {
    return this.http.get(`${this.base}/users`);
  }

  getPedidos() {
    return this.http.get(`${this.base}/pedidos`);
  }

  login(usuario: string, contrasena: string) {
    return this.http.post(`${this.base}/auth/login`, { usuario, contrasena });
  }
}
