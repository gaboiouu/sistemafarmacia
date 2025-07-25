import { Component, OnInit } from '@angular/core';
import { InventarioService } from './inventario.service';
import { Producto } from '../models/producto.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {
  inventario: Producto[] = [];

  constructor(
    private inventarioService: InventarioService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadInventario();
  }

  loadInventario(): void {
    this.inventarioService.getInventario().subscribe(
      (data) => {
        this.inventario = data;
      },
      (error) => {
        this.toastr.error('Error al cargar el inventario.');
        console.error(error);
      }
    );
  }
}
