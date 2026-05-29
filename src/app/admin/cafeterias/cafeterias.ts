import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

interface Cafeteria {
  id: number;
  name: string;
  open: boolean;
  servesFood: boolean;
}

@Component({
  selector: 'app-admin-cafeterias',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cafeterias.html',
  styleUrl: './cafeterias.scss'
})
export class CafeteriasComponent implements OnInit {
  private api = inject(ApiService);

  cafeterias = signal<Cafeteria[]>([]);
  cargando = signal(true);
  editando = signal(false);
  formId: number | null = null;
  formNombre = '';

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.api.getCafeterias().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : data?.content || [];
        this.cafeterias.set(list);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  nuevo() {
    this.editando.set(true);
    this.formId = null;
    this.formNombre = '';
  }

  editar(c: Cafeteria) {
    this.editando.set(true);
    this.formId = c.id;
    this.formNombre = c.name;
  }

  cancelar() {
    this.editando.set(false);
  }

  guardar() {
    const body = { name: this.formNombre };

    if (this.formId) {
      this.api.updateCafeteria(this.formId, body).subscribe({
        next: () => { this.editando.set(false); this.cargar(); }
      });
    } else {
      this.api.createCafeteria(body).subscribe({
        next: () => { this.editando.set(false); this.cargar(); }
      });
    }
  }

  eliminar(c: Cafeteria) {
    if (!confirm(`¿Eliminar "${c.name}"?`)) return;
    this.api.deleteCafeteria(c.id).subscribe({
      next: () => this.cargar()
    });
  }
}
