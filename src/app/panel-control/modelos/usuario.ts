import { Rol } from './rol';

// Interfaz para el perfil de usuario, usada en toda la aplicación
export interface UserProfile {
  id?: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: Rol;
  fechaRegistro?: Date;
}

// Interfaz para el payload de cambio de contraseña
export interface ChangePasswordPayload {
  contrasenaActual: string;
  nuevaContrasena: string;
}

// Interfaz para el payload de creación de un nuevo usuario por un admin
export interface CreateUserPayload {
  nombres: string;
  apellidos: string;
  email: string;
  rol: Rol;
  password?: string;
}