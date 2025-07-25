import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = '/api/cliente';

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.baseUrl);
  }

  getClienteByDni(dni: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dni/${dni}`);
  }

  createClienteManual(cliente: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/manual`, cliente);
  }

  buscarPorNombre(termino: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.baseUrl}/buscar?termino=${termino}`);
  }
}
