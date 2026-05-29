import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

interface Producto {
  id: number;
  name: string;
  type: string;
  price: number;
  stock: number;
  active: boolean;
}

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.scss'
})
export class ProductosComponent implements OnInit {
  private api = inject(ApiService);

  productos = signal<Producto[]>([]);
  cargando = signal(true);
  editando = signal(false);
  formId: number | null = null;
  formNombre = '';
  formTipo = '';
  formPrecio = 0;
  formStock = 0;

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.api.getProducts().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : data?.content || [];
        this.productos.set(list);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  nuevo() {
    this.editando.set(true);
    this.formId = null;
    this.formNombre = '';
    this.formTipo = 'General';
    this.formPrecio = 0;
    this.formStock = 0;
  }

  editar(p: Producto) {
    this.editando.set(true);
    this.formId = p.id;
    this.formNombre = p.name;
    this.formTipo = p.type;
    this.formPrecio = p.price;
    this.formStock = p.stock;
  }

  cancelar() {
    this.editando.set(false);
  }

  guardar() {
    const body = {
      name: this.formNombre,
      type: this.formTipo,
      price: this.formPrecio,
      stock: this.formStock
    };

    if (this.formId) {
      this.api.updateProduct(this.formId, body).subscribe({
        next: () => { this.editando.set(false); this.cargar(); }
      });
    } else {
      this.api.createProduct(body).subscribe({
        next: () => { this.editando.set(false); this.cargar(); }
      });
    }
  }

  eliminar(p: Producto) {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    this.api.deleteProduct(p.id).subscribe({
      next: () => this.cargar()
    });
  }
}
