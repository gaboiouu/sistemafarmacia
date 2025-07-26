export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  cantidad: number;
  fechaVencimiento: string; // Usar string para compatibilidad con JSON
  descripcion: string;
  categoria: string;
  sede?: any; // Puedes tipar esto mejor si usas la entidad Sede
}
