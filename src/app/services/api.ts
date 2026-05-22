import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';

export interface LoginResponse {
  token: string;
  rol: 'USER' | 'STAFF_COCINA' | 'STAFF_CAJERO' | 'ADMIN';
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);
  private router = inject(Router);

  // ───────────────── API BASE ─────────────────
  private base = 'http://localhost:8080/api';

  private unwrapData<T>() {
    return map((res: any) => res?.data);
  }

  // ───────────────── AUTH ─────────────────

  login(username: string, password: string) {

    return this.http.post<LoginResponse>(
      `${this.base}/auth/login`,
      {
        username,
        password
      }
    ).pipe(
      map((res: any) => res?.data as LoginResponse),
      tap(({ token, rol, username }) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('rol', rol);
          localStorage.setItem('username', username);
        }
      })
    );
  }

  register(data: {
    fullName: string;
    username: string;
    email: string;
    password: string;
  }) {

    return this.http.post(
      `${this.base}/auth/register`,
      data
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
    return localStorage.getItem('rol');
  }

  getUsername(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('username');
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

    return this.getRol() === 'USER';
  }

  // ───────────────── USERS ─────────────────

  getUsers() {

    return this.http.get(
      `${this.base}/users`
    ).pipe(this.unwrapData());
  }

  getMe() {

    return this.http.get(
      `${this.base}/users/me`
    ).pipe(this.unwrapData());
  }

  getUserById(id: number) {

    return this.http.get(
      `${this.base}/users/${id}`
    ).pipe(this.unwrapData());
  }

  updateRol(userId: number, rol: string) {

    return this.http.put(
      `${this.base}/users/${userId}/rol`,
      { rol }
    ).pipe(this.unwrapData());
  }

  deleteUser(userId: number) {

    return this.http.delete(
      `${this.base}/users/${userId}`
    ).pipe(this.unwrapData());
  }

  // ───────────────── ORDERS ─────────────────

  getOrders() {

    return this.http.get(
      `${this.base}/orders`
    ).pipe(this.unwrapData());
  }

  getOrderById(id: number) {

    return this.http.get(
      `${this.base}/orders/${id}`
    ).pipe(this.unwrapData());
  }

  crearOrder(order: any) {

    return this.http.post(
      `${this.base}/orders`,
      order
    ).pipe(this.unwrapData());
  }

  actualizarEstadoOrder(
    id: number,
    estado: string
  ) {

    return this.http.put(
      `${this.base}/orders/${id}`,
      { estado }
    ).pipe(this.unwrapData());
  }

  deleteOrder(id: number) {

    return this.http.delete(
      `${this.base}/orders/${id}`
    ).pipe(this.unwrapData());
  }

  getPedidos() {
    return this.getOrders();
  }

  actualizarEstadoPedido(id: number, estado: string) {
    return this.actualizarEstadoOrder(id, estado);
  }

  // ───────────────── DASHBOARD ─────────────────

  getDashboardStats() {

    return this.http.get(
      `${this.base}/dashboard/stats`
    ).pipe(this.unwrapData());
  }

  getRecentOrders() {

    return this.http.get(
      `${this.base}/dashboard/recent-orders`
    ).pipe(this.unwrapData());
  }

  // ───────────────── PRODUCTS ─────────────────

  getProducts() {

    return this.http.get(
      `${this.base}/products`
    ).pipe(this.unwrapData());
  }

  createProduct(product: any) {

    return this.http.post(
      `${this.base}/products`,
      product
    ).pipe(this.unwrapData());
  }

  updateProduct(
    id: number,
    product: any
  ) {

    return this.http.put(
      `${this.base}/products/${id}`,
      product
    ).pipe(this.unwrapData());
  }

  deleteProduct(id: number) {

    return this.http.delete(
      `${this.base}/products/${id}`
    ).pipe(this.unwrapData());
  }

  // ───────────────── CAFETERIAS ─────────────────

  getCafeterias() {

    return this.http.get(
      `${this.base}/cafeterias`
    ).pipe(this.unwrapData());
  }

  // ───────────────── PAYMENTS ─────────────────

  getPayments() {

    return this.http.get(
      `${this.base}/payments`
    ).pipe(this.unwrapData());
  }

  createPayment(payment: any) {

    return this.http.post(
      `${this.base}/payments`,
      payment
    ).pipe(this.unwrapData());
  }
}
