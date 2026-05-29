import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { WebSocketService, WsNotification } from './websocket.service';

export type NotificationItem = {
  id: number;
  title: string;
  message: string;
  date: string;
  type: 'Pedido' | 'Sistema' | 'Recordatorio';
  read: boolean;
};

export interface NotificationResponse {
  id: number;
  type: string;
  orderId: number;
  orderNumber: string;
  message: string;
  status: string;
  read: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private ws = inject(WebSocketService);
  private readonly base = environment.apiUrl;

  private notificationsSubject = new BehaviorSubject<NotificationItem[]>([]);

  readonly notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    this.ws.notifications$.subscribe(wsMsg => this.handleWsNotification(wsMsg));
  }

  connectWebSocket() {
    this.ws.connect();
  }

  getNotifications(): Observable<NotificationItem[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return of([]);

    return this.http.get<{ data: NotificationResponse[] }>(`${this.base}/notifications/me`).pipe(
      map(res => (res?.data ?? []).map(n => this.mapResponseToItem(n))),
      tap(items => {
        const current = this.notificationsSubject.value;
        const existingIds = new Set(current.map(i => i.id));
        const merged = [
          ...current.filter(i => i.id < 0),
          ...items.filter(i => !existingIds.has(i.id)),
        ];
        merged.sort((a, b) => b.id - a.id);
        this.notificationsSubject.next(merged);
      })
    );
  }

  markAsRead(id: number) {
    this.http.put(`${this.base}/notifications/${id}/read`, {}).subscribe();
    this.notificationsSubject.next(
      this.notificationsSubject.value.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  }

  markAllAsRead() {
    this.http.put(`${this.base}/notifications/read-all`, {}).subscribe();
    this.notificationsSubject.next(
      this.notificationsSubject.value.map(n => ({ ...n, read: true }))
    );
  }

  private handleWsNotification(wsMsg: WsNotification) {
    const item = this.wsToItem(wsMsg);
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([item, ...current]);
  }

  private typeLabel(raw: string): 'Pedido' | 'Sistema' | 'Recordatorio' {
    if (raw === 'CREATED' || raw === 'CANCELLED') return 'Pedido';
    if (raw === 'STATUS_CHANGED' || raw === 'UPDATED') return 'Pedido';
    return 'Sistema';
  }

  private relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Ahora';
    if (mins < 60) return `Hace ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
  }

  private wsToItem(ws: WsNotification): NotificationItem {
    return {
      id: -(Date.now() + Math.floor(Math.random() * 1000)),
      title: this.titleFromType(ws.type, ws.orderNumber),
      message: ws.message,
      date: this.relativeTime(ws.timestamp),
      type: this.typeLabel(ws.type),
      read: false,
    };
  }

  private titleFromType(type: string, orderNumber: string): string {
    switch (type) {
      case 'CREATED': return `Nuevo pedido #${orderNumber}`;
      case 'STATUS_CHANGED': return `Pedido #${orderNumber} actualizado`;
      case 'UPDATED': return `Pedido #${orderNumber} modificado`;
      case 'CANCELLED': return `Pedido #${orderNumber} cancelado`;
      default: return `Pedido #${orderNumber}`;
    }
  }

  private mapResponseToItem(n: NotificationResponse): NotificationItem {
    return {
      id: n.id,
      title: this.titleFromType(n.type, n.orderNumber),
      message: n.message,
      date: this.relativeTime(n.createdAt),
      type: this.typeLabel(n.type),
      read: n.read,
    };
  }
}
