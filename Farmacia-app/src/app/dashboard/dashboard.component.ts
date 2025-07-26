// ...existing code...
// ...existing code...
import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Venta } from '../models/venta.model';
import { ToastrService } from 'ngx-toastr';
import { Producto } from '../models/producto.model';
import { ProductoService } from '../productos/producto.service';
import { calcularProductosMasVendidos } from './productos-mas-vendidos.util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  get productosMasVendidosPie() {
    return this.productosMasVendidos.map(p => ({ name: p.nombre, value: p.cantidad }));
  }
  selectedProductoId: number | null = null;
  get productosFiltrados() {
    if (!this.selectedProductoId) {
      return this.productosMasVendidos;
    }
    return this.productosMasVendidos.filter((p: any) => p.id === this.selectedProductoId);
  }
  ventasPorDia: any[] = [];
  ventasPorProducto: any[] = [];
  productosMasVendidos: { id: number, nombre: string, cantidad: number }[] = [];
  productos: Producto[] = [];

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
    private productoService: ProductoService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.productoService.getProductos().subscribe(
      productos => {
        this.productos = productos;
        console.log('Productos cargados:', this.productos);
        this.loadVentas();
      },
      error => {
        this.toastr.error('No se pudieron cargar los productos.');
      }
    );
  }

  loadVentas(): void {
    this.dashboardService.getVentas().subscribe(
      (data) => {
        // Filtrar ventas nulas o con cliente nulo
        const ventasValidas = (data || []).filter(v => v && v.idcliente != null);
        console.log('Ventas válidas cargadas:', ventasValidas);
        this.processVentasData(ventasValidas);
        // Calcular productos más vendidos
        this.productosMasVendidos = calcularProductosMasVendidos(ventasValidas, this.productos);
      },
      (error) => {
        this.toastr.error('No se pudo cargar el historial de ventas. Verifique los datos o contacte al administrador.');
        console.error('Error al cargar ventas:', error);
      }
    );
  }

  processVentasData(ventas: Venta[]): void {
    // Procesar ventas por día
    const ventasDiaMap = new Map<string, number>();
    ventas.forEach(venta => {
      console.log('Venta recibida:', venta);
      const dia = new Date(venta.fechaRegistro).toLocaleDateString();
      const total = ventasDiaMap.get(dia) || 0;
      ventasDiaMap.set(dia, total + venta.precioTotal);
    });
    this.ventasPorDia = Array.from(ventasDiaMap.entries()).map(([name, value]) => ({ name, value }));

    // Procesar ventas por producto usando el nombre real del producto
    if (!this.productos || this.productos.length === 0) {
      this.ventasPorProducto = [];
      this.toastr.error('No hay productos cargados. No se puede mostrar el gráfico de ventas por producto.');
      return;
    }
    const ventasProductoMap = new Map<string, number>();
    ventas.forEach(venta => {
      if (venta.detalles && Array.isArray(venta.detalles)) {
        venta.detalles.forEach(detalle => {
          // Buscar el nombre real del producto
          const productoObj = this.productos.find(p => p.id === detalle.idproducto);
          if (!productoObj) {
            console.warn('No se encontró producto para el detalle:', detalle, 'en productos:', this.productos);
          }
          const productoNombre = productoObj ? productoObj.nombre : `Producto ${detalle.idproducto}`;
          const total = ventasProductoMap.get(productoNombre) || 0;
          ventasProductoMap.set(productoNombre, total + (detalle.precio * detalle.cantidad));
        });
      }
    });
    this.ventasPorProducto = Array.from(ventasProductoMap.entries()).map(([name, value]) => ({ name, value }));
    console.log('Ventas por producto generadas:', this.ventasPorProducto);
  }
}
