import { Rol } from './rol';

export interface UserProfile {
  id?: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: Rol;
  fechaRegistro?: Date;
}

export interface ChangePasswordPayload {
  contrasenaActual: string;
  nuevaContrasena: string;
}

export interface CreateUserPayload {
  nombres: string;
  apellidos: string;
  email: string;
  rol: Rol;
  password?: string;
}