// RUTA: src/app/panel-control/servicios/usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // 'of' para simular datos
import { environment } from '../../environments/environment';

// Interfaces para los datos del perfil
export interface UserProfile {
  nombres: string;
  apellidos: string;
  email: string;
  rol: string; 
  fechaRegistro: Date; 
}

export interface ChangePasswordPayload {
  contrasenaActual: string;
  nuevaContrasena: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  // NOTA: Este método necesitará un endpoint real: GET /api/usuarios/me
  getMiPerfil(): Observable<UserProfile> {
    // Simulación con más datos
    const mockUser: UserProfile = {
      nombres: 'Dr.',
      apellidos: 'Admin',
      email: 'admin@clinicabienestar.com',
      rol: 'ADMINISTRADOR', // Rol del usuario
      fechaRegistro: new Date('2024-01-15T10:00:00Z') // Fecha de registro
    };
    return of(mockUser);
    // return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }
  // NOTA: Este método necesitará un endpoint real: PUT /api/usuarios/me
  actualizarPerfil(perfil: UserProfile): Observable<UserProfile> {
    console.log('Actualizando perfil (simulado):', perfil);
    return of(perfil);
    // return this.http.put<UserProfile>(`${this.apiUrl}/me`, perfil); // Así sería con el backend
  }

  // NOTA: Este método necesitará un endpoint real: POST /api/usuarios/me/cambiar-contrasena
  cambiarContrasena(payload: ChangePasswordPayload): Observable<any> {
    console.log('Cambiando contraseña (simulado)');
    return of({ message: 'Contraseña actualizada con éxito' });
    // return this.http.post(`${this.apiUrl}/me/cambiar-contrasena`, payload); // Así sería con el backend
  }
}