import { Injectable, inject } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject, Observable, filter } from 'rxjs';
import { ApiService } from './api';
import { environment } from '../../environments/environment';

export interface WsNotification {
  type: string;
  orderId: number;
  orderNumber: string;
  message: string;
  status: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private api = inject(ApiService);

  private client: Client;
  private notificationsSubject = new BehaviorSubject<WsNotification | null>(null);
  private connectedSubject = new BehaviorSubject<boolean>(false);

  readonly notifications$: Observable<WsNotification> = this.notificationsSubject
    .asObservable()
    .pipe(filter((n): n is WsNotification => n !== null));

  readonly connected$ = this.connectedSubject.asObservable();

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new WebSocket(environment.wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        this.connectedSubject.next(true);

        this.client.subscribe('/all/notifications', msg => {
          const notification: WsNotification = JSON.parse(msg.body);
          this.notificationsSubject.next(notification);
        });

        this.client.subscribe('/user/specific/notifications', msg => {
          const notification: WsNotification = JSON.parse(msg.body);
          this.notificationsSubject.next(notification);
        });
      },
      onDisconnect: () => {
        this.connectedSubject.next(false);
      },
      onStompError: () => {
        this.connectedSubject.next(false);
      },
    });
  }

  connect() {
    const token = this.api.getToken();
    if (!token || this.client.connected || this.client.active) return;

    this.client.connectHeaders = { Authorization: `Bearer ${token}` };
    this.client.activate();
  }

  disconnect() {
    this.client.deactivate();
  }
}
