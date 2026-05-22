import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
  username = '';

  eventos = [
    { label: 'Evento Especial', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&q=80' },
    { label: 'Waffle Fest', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&q=80' },
    { label: 'Happy Coffee', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=80' },
    { label: '2x1 Lunes', img: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&q=80' },
  ];

  ngOnInit() {
    this.username = this.api.getUsername() ?? '';
  }
}
