import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Venta } from '../models/venta.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  ventasPorDia: any[] = [];
  ventasPorProducto: any[] = [];

  // Opciones de los gráficos
  view: [number, number] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Día';
  showYAxisLabel = true;
  yAxisLabel = 'Total Ventas';

  constructor(
    private dashboardService: DashboardService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadVentas();
  }

  loadVentas(): void {
    this.dashboardService.getVentas().subscribe(
      (data) => {
        this.processVentasData(data);
      },
      (error) => {
        this.toastr.error('Error al cargar los datos del dashboard.');
        console.error(error);
      }
    );
  }

  processVentasData(ventas: Venta[]): void {
    // Procesar ventas por día
    const ventasDiaMap = new Map<string, number>();
    ventas.forEach(venta => {
      const dia = new Date(venta.fechaRegistro).toLocaleDateString();
      const total = ventasDiaMap.get(dia) || 0;
      ventasDiaMap.set(dia, total + venta.precioTotal);
    });
    this.ventasPorDia = Array.from(ventasDiaMap.entries()).map(([name, value]) => ({ name, value }));

    // Procesar ventas por producto
    const ventasProductoMap = new Map<string, number>();
    ventas.forEach(venta => {
      venta.detalles.forEach(detalle => {
        const producto = `Producto ${detalle.idproducto}`; // Deberíamos tener el nombre del producto aquí
        const total = ventasProductoMap.get(producto) || 0;
        ventasProductoMap.set(producto, total + (detalle.precio * detalle.cantidad));
      });
    });
    this.ventasPorProducto = Array.from(ventasProductoMap.entries()).map(([name, value]) => ({ name, value }));
  }
}
