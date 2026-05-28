import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api';
import { NotificationsComponent } from '../shared/notifications/notifications';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, NotificationsComponent],
  templateUrl: './shell.html',
  styleUrl: './shell.scss'
})
export class ShellComponent {
  api = inject(ApiService);
}
