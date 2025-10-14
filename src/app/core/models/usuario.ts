import { Role } from './rol';

// Esta interfaz representa el perfil de un usuario que recibimos del backend.
export interface UserProfile {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  fechaRegistro: Date;
  roles: Role[]; // <-- CAMBIO CLAVE: de 'rol: string' a 'roles: Role[]'
}

// Esta interfaz se usará para enviar datos al backend al crear/actualizar.
export interface UpdateUserRequest {
  nombres?: string;
  apellidos?: string;
  // El email no se puede actualizar
  roleIds?: number[]; // <-- CAMBIO CLAVE: Enviamos un array de IDs de roles.
}