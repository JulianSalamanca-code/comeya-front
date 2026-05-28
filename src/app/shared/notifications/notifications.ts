import { Component, computed, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NotificationService, NotificationItem } from '../../services/notification';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss'
})
export class NotificationsComponent {
  private notificationService = inject(NotificationService);
  private api = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  notifications = signal<NotificationItem[]>([]);
  panelOpen = signal(false);
  loading = signal(true);

  unreadCount = computed(() => this.notifications().filter(item => !item.read).length);

  constructor() {
    if (this.api.isLoggedIn()) {
      this.notificationService.connectWebSocket();
    }

    this.notificationService.notifications$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(notifications => {
      this.notifications.set(notifications);
      this.loading.set(false);
    });

    this.loadNotifications();
  }

  togglePanel() {
    this.panelOpen.update(value => !value);
  }

  closePanel() {
    this.panelOpen.set(false);
  }

  loadNotifications() {
    this.loading.set(true);
    this.notificationService.getNotifications().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {},
      error: () => this.loading.set(false)
    });
  }

  markAsRead(notification: NotificationItem) {
    if (notification.read) return;
    this.notificationService.markAsRead(notification.id);
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  onBackdropClick(event: MouseEvent) {
    const panelEl = this.panel()?.nativeElement;
    if (panelEl && !panelEl.contains(event.target as Node)) {
      this.closePanel();
    }
  }
}
