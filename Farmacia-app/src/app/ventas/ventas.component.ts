import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VentaService } from './venta.service';
import { ProductoService } from '../productos/producto.service';
import { Cliente } from '../models/cliente.model';
import { Producto } from '../models/producto.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  getNombreCliente(): string {
    if (!this.cliente) return '';
    const nombres = this.cliente.nombres ? this.cliente.nombres : '';
    const apellidos = this.cliente.apellidos ? this.cliente.apellidos : '';
    return (nombres + ' ' + apellidos).trim();
  }
  getNombreProducto(id: number): string {
    const prod = this.productos.find((p: Producto) => p.id === +id);
    return prod ? prod.nombre : '';
  }
  ventaForm: FormGroup;
  cliente: Cliente | null = null;
  productos: Producto[] = [];
  totalVenta = 0;

  constructor(
    private fb: FormBuilder,
    private ventaService: VentaService,
    private productoService: ProductoService,
    private toastr: ToastrService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.cliente = navigation?.extras.state?.['cliente'] || null;

    this.ventaForm = this.fb.group({
      cliente: [this.getNombreCliente()],
      detalles: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadProductos();
    this.addDetalle();
  }

  loadProductos(): void {
    this.productoService.getProductos().subscribe(data => this.productos = data);
  }

  get detalles(): FormArray {
    return this.ventaForm.get('detalles') as FormArray;
  }

  addDetalle(): void {
    const detalleForm = this.fb.group({
      idproducto: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio: [{ value: 0, disabled: true }]
    });

    detalleForm.get('idproducto')?.valueChanges.subscribe(id => {
      if (id) {
        const producto = this.productos.find(p => p.id === +id);
        if (producto) {
          detalleForm.get('precio')?.setValue(producto.precio);
          this.calculateTotal();
        }
      }
    });

    detalleForm.get('cantidad')?.valueChanges.subscribe(() => this.calculateTotal());

    this.detalles.push(detalleForm);
  }

  removeDetalle(index: number): void {
    this.detalles.removeAt(index);
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalVenta = this.detalles.controls.reduce((acc, control) => {
      const precio = control.get('precio')?.value || 0;
      const cantidad = control.get('cantidad')?.value || 0;
      return acc + (precio * cantidad);
    }, 0);
  }

  onSubmit(): void {
    if (this.ventaForm.valid && this.cliente) {
      const ventaData = {
        idcliente: this.cliente.id,
        fechaRegistro: new Date(),
        precioTotal: this.totalVenta,
        sede: { id: 1 }, // Assuming a default sede
        detalles: this.ventaForm.value.detalles
      };

      this.ventaService.createVenta(ventaData).subscribe(
        () => {
          this.toastr.success('Venta registrada con éxito.');
          this.imprimirBoleta();
          setTimeout(() => {
            this.router.navigate(['/clientes']);
          }, 500);
        },
        (error) => {
          this.toastr.error('Error al registrar la venta.');
          console.error(error);
        }
      );
    }
  }

  fechaActual: Date = new Date();

  imprimirBoleta(): void {
    // Oculta todo menos la boleta
    const originalBody = document.body.innerHTML;
    const boletaHtml = (document.getElementById('boletaImpresion') as HTMLElement).innerHTML;
    document.body.innerHTML = boletaHtml;
    window.print();
    document.body.innerHTML = originalBody;
    window.location.reload();
  }
}
