import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from './producto.service';
import { Producto } from '../models/producto.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  productoForm: FormGroup;
  isEditMode = false;
  currentProductoId: number | null = null;
  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private toastr: ToastrService
  ) {
    this.productoForm = this.fb.group({
      cod_producto: ['', Validators.required],
      nom_producto: ['', Validators.required],
      concentracion: [''],
      nom_form_farmaceutica: [''],
      nom_form_farm_simplificada: [''],
      presentacion: [''],
      fracciones: [1],
      fec_vencimiento: ['', Validators.required],
      num_lote: [''],
      rs: [''],
      precio_venta: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      id_laboratorio: [1, Validators.required],
      id_proveedor: [1, Validators.required]
    });

    this.filterForm = this.fb.group({
      nombre: [''],
      categoria: ['']
    });
  }

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.productoService.getProductos().subscribe(
      (data) => {
        this.productos = data;
      },
      (error) => {
        this.toastr.error('Error al cargar los productos.');
        console.error(error);
      }
    );
  }

  onFilter(): void {
    const { nombre, categoria } = this.filterForm.value;
    if (nombre) {
      this.productoService.buscarPorNombre(nombre).subscribe(data => this.productos = data);
    } else if (categoria) {
      this.productoService.buscarPorCategoria(categoria).subscribe(data => this.productos = data);
    } else {
      this.loadProductos();
    }
  }

  onSubmit(): void {
    if (this.productoForm.valid) {
      if (this.isEditMode && this.currentProductoId) {
        this.productoService.updateProducto(this.currentProductoId, this.productoForm.value).subscribe(
          () => {
            this.toastr.success('Producto actualizado con éxito.');
            this.resetForm();
            this.loadProductos();
          },
          (error) => {
            this.toastr.error('Error al actualizar el producto.');
            console.error(error);
          }
        );
      } else {
        this.productoService.createProducto(this.productoForm.value).subscribe(
          () => {
            this.toastr.success('Producto creado con éxito.');
            this.resetForm();
            this.loadProductos();
          },
          (error) => {
            this.toastr.error('Error al crear el producto.');
            console.error(error);
          }
        );
      }
    }
  }

  editProducto(producto: Producto): void {
    this.isEditMode = true;
    this.currentProductoId = producto.id_producto!;
    this.productoForm.patchValue(producto);
  }

  deleteProducto(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
      this.productoService.deleteProducto(id).subscribe(
        () => {
          this.toastr.success('Producto eliminado con éxito.');
          this.loadProductos();
        },
        (error) => {
          this.toastr.error('Error al eliminar el producto.');
          console.error(error);
        }
      );
    }
  }

  resetForm(): void {
    this.isEditMode = false;
    this.currentProductoId = null;
    this.productoForm.reset({
      fracciones: 1,
      precio_venta: 0,
      stock: 0,
      id_laboratorio: 1,
      id_proveedor: 1
    });
  }
}
