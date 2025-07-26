export interface Cliente {
  id?: number;
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono?: string;
  fuenteDatos: string;
  fechaRegistro: string;
  // Campos legacy opcionales para compatibilidad
  nombre?: string;
  apellidos?: string;
}
