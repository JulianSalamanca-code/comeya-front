import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

function decodeJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function unwrap(res: any): any {
  return res?.data ?? res;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);
  private router = inject(Router);

  private base = environment.apiUrl;

  // ───────────────── AUTH ─────────────────

  login(email: string, password: string) {
    return this.http.post(
      `${this.base}/auth/login`,
      { email, password }
    ).pipe(
      map((res: any) => {
        const payload = decodeJwt(res?.data?.token);
        const role = payload?.role || 'CUSTOMER';
        const name = payload?.sub || email;
        return { token: res?.data?.token, role, name };
      }),
      tap(({ token, role, name }) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('rol', role);
          localStorage.setItem('username', name);
        }
      })
    );
  }

  register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    return this.http.post(
      `${this.base}/auth/register`,
      data
    );
  }

  forgotPassword(email: string) {
    return this.http.post<{ data: string }>(
      `${this.base}/auth/forgot-password`,
      { email }
    ).pipe(map(res => res.data));
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(
      `${this.base}/auth/reset-password`,
      { token, newPassword }
    );
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    this.router.navigate(['/login']);
  }

  // ───────────────── HELPERS ─────────────────

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    if (typeof window === 'undefined') return null;
    let rol = localStorage.getItem('rol');
    if (!rol) {
      const token = this.getToken();
      if (token) {
        const payload = decodeJwt(token);
        rol = payload?.role || null;
        if (rol) localStorage.setItem('rol', rol);
      }
    }
    return rol;
  }

  getUsername(): string | null {
    if (typeof window === 'undefined') return null;
    let name = localStorage.getItem('username');
    if (!name) {
      const token = this.getToken();
      if (token) {
        const payload = decodeJwt(token);
        name = payload?.sub || null;
        if (name) localStorage.setItem('username', name);
      }
    }
    return name;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ───────────────── ROLES ─────────────────

  isAdmin(): boolean {
    return this.getRol() === 'ADMIN';
  }

  isCocina(): boolean {
    return this.getRol() === 'STAFF_COCINA';
  }

  isCajero(): boolean {
    return this.getRol() === 'STAFF_CAJERO';
  }

  isUser(): boolean {
    return this.getRol() === 'CUSTOMER';
  }

  // ───────────────── USERS ─────────────────

  getUsers() {
    return this.http.get(`${this.base}/users`).pipe(map(unwrap));
  }

  getMe() {
    return this.http.get(`${this.base}/users/me`).pipe(map(unwrap));
  }

  getUserById(id: number) {
    return this.http.get(`${this.base}/users/${id}`).pipe(map(unwrap));
  }

  updateRol(userId: number, rol: string) {
    return this.http.put(`${this.base}/users/${userId}/rol`, { rol }).pipe(map(unwrap));
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.base}/users/${userId}`).pipe(map(unwrap));
  }

  // ───────────────── ORDERS ─────────────────

  getOrders() {
    return this.http.get(`${this.base}/orders`).pipe(map(unwrap));
  }

  getOrderById(id: number) {
    return this.http.get(`${this.base}/orders/${id}`).pipe(map(unwrap));
  }

  crearOrder(order: any) {
    return this.http.post(`${this.base}/orders`, order).pipe(map(unwrap));
  }

  actualizarEstadoOrder(id: number, estado: string) {
    return this.http.put(`${this.base}/orders/${id}`, { estado }).pipe(map(unwrap));
  }

  deleteOrder(id: number) {
    return this.http.delete(`${this.base}/orders/${id}`).pipe(map(unwrap));
  }

  getPedidos() {
    return this.getOrders();
  }

  actualizarEstadoPedido(id: number, estado: string) {
    return this.actualizarEstadoOrder(id, estado);
  }

  // ───────────────── DASHBOARD ─────────────────

  getDashboardStats() {
    return this.http.get(`${this.base}/dashboard/stats`).pipe(map(unwrap));
  }

  getRecentOrders() {
    return this.http.get(`${this.base}/dashboard/recent-orders`).pipe(map(unwrap));
  }

  // ───────────────── PRODUCTS ─────────────────

  getProducts() {
    return this.http.get(`${this.base}/products`).pipe(
      map((res: any) => {
        const data = unwrap(res);
        return data?.content || data || [];
      })
    );
  }

  createProduct(product: any) {
    return this.http.post(`${this.base}/products`, product).pipe(map(unwrap));
  }

  updateProduct(id: number, product: any) {
    return this.http.put(`${this.base}/products/${id}`, product).pipe(map(unwrap));
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.base}/products/${id}`).pipe(map(unwrap));
  }

  // ───────────────── CAFETERIAS ─────────────────

  getCafeterias() {
    return this.http.get(`${this.base}/cafeterias`).pipe(map(unwrap));
  }

  // ───────────────── PAYMENTS ─────────────────

  getPayments() {
    return this.http.get(`${this.base}/payments`).pipe(map(unwrap));
  }

  createPayment(payment: any) {
    return this.http.post(`${this.base}/payments`, payment).pipe(map(unwrap));
  }
}
