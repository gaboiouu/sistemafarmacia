import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';
import { ProductoService } from '../productos/producto.service';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private productoService: ProductoService) { }

  getInventario(): Observable<Producto[]> {
    return this.productoService.getProductos();
  }
}
