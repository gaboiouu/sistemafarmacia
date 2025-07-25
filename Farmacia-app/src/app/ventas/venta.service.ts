import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta.model';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private baseUrl = '/api/venta';

  constructor(private http: HttpClient) { }

  createVenta(ventaData: any): Observable<Venta> {
    return this.http.post<Venta>(this.baseUrl, ventaData);
  }
}
