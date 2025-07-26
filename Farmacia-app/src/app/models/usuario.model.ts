export interface Usuario {
  id?: number;
  username: string;
  password?: string;
  nombreCompleto: string;
  email: string;
  rol: 'ADMIN' | 'VENDEDOR';
  activo?: boolean;
  sede?: any;
}
