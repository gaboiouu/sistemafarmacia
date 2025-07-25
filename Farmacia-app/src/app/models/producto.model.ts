export interface Producto {
  id_producto?: number;
  cod_producto: string;
  nom_producto: string;
  concentracion: string;
  nom_form_farmaceutica: string;
  nom_form_farm_simplificada: string;
  presentacion: string;
  fracciones?: number;
  fec_vencimiento: Date;
  num_lote: string;
  rs: string;
  precio_venta: number;
  stock: number;
  id_laboratorio: number;
  id_proveedor: number;
}
