export interface Usuario {
  id?: number;
  username: string;
  nombreCompleto: string;
  rol: 'ADMIN' | 'VENDEDOR';
  activo?: boolean;
  sede?: any;
}
