import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export type NotificationItem = {
  id: number;
  title: string;
  message: string;
  date: string;
  type: 'Pedido' | 'Sistema' | 'Recordatorio';
  read: boolean;
};

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private readonly base = environment.apiUrl;
  private readonly useMock = true;

  private readonly mockNotifications: NotificationItem[] = [
    {
      id: 1,
      title: 'Pedido en camino',
      message: 'Tu pedido #1245 está en preparación y llegará en menos de 10 minutos.',
      date: 'Ahora',
      type: 'Pedido',
      read: false
    },
    {
      id: 2,
      title: 'Pago confirmado',
      message: 'Hemos confirmado el pago de tu pedido #1239 con éxito.',
      date: 'Hace 20 min',
      type: 'Sistema',
      read: false
    },
    {
      id: 3,
      title: 'Recuerda tu carrito',
      message: 'Tienes artículos pendientes en el carrito. Completa tu pedido antes de que cierren.',
      date: 'Ayer',
      type: 'Recordatorio',
      read: true
    }
  ];

  getNotifications() {
    if (this.useMock) {
      return of(this.mockNotifications).pipe(delay(250));
    }

    return this.http.get<{ data: NotificationItem[] }>(`${this.base}/notifications/me`).pipe(
      map(response => response?.data ?? [])
    );
  }
}
