import { Producto } from '../models/producto.model';
import { Venta } from '../models/venta.model';

/**
 * Devuelve un array de productos más vendidos con su cantidad total vendida.
 * @param ventas Lista de ventas
 * @param productos Lista de productos
 */
export function calcularProductosMasVendidos(ventas: Venta[], productos: Producto[]) {
  const conteo: { [id: number]: number } = {};
  ventas.forEach(venta => {
    if (venta.detalles && Array.isArray(venta.detalles)) {
      venta.detalles.forEach(detalle => {
        conteo[detalle.idproducto] = (conteo[detalle.idproducto] || 0) + detalle.cantidad;
      });
    }
  });
  // Unir con nombre de producto
  return Object.entries(conteo)
    .map(([id, cantidad]) => {
      const prod = productos.find(p => p.id === +id);
      return {
        id: +id,
        nombre: prod ? prod.nombre : `Producto ${id}`,
        cantidad: cantidad as number
      };
    })
    .sort((a, b) => b.cantidad - a.cantidad);
}
