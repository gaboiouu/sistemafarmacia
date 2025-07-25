import { VentaDetalle } from './venta-detalle.model';

export interface Venta {
  id_venta?: number;
  idcliente: number;
  fechaRegistro: Date;
  precioTotal: number;
  sede: any;
  detalles: VentaDetalle[];
}
