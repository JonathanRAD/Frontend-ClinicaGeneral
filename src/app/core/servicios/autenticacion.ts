// RUTA: src/app/core/servicios/autenticacion.ts

import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface AuthResponse {
  token: string;
}

interface RegisterPayload {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
}

// Interfaz para el payload decodificado del token
interface DecodedToken {
  sub: string;
  rol: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Señales públicas para que los componentes puedan reaccionar a los cambios
  usuarioLogueado = signal<boolean>(false);
  rolUsuario = signal<string>('');

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // Al iniciar el servicio, verificamos si ya existe un token válido
    const token = this.getToken();
    if (token) {
      this.usuarioLogueado.set(true);
      this.decodificarToken(token);
    }
  }

  /**
   * Envía las credenciales al backend para iniciar sesión.
   */
  login(email: string, contrasena: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password: contrasena })
      .pipe(
        tap(response => {
          this.manejarRespuestaAutenticacion(response.token);
        })
      );
  }

  /**
   * Envía los datos de un nuevo usuario para registrarse.
   */
  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload)
      .pipe(
        tap(response => {
          this.manejarRespuestaAutenticacion(response.token);
        })
      );
  }

  /**
   * Cierra la sesión del usuario, eliminando el token y reseteando las señales.
   */
  logout() {
    localStorage.removeItem('jwt_token');
    this.usuarioLogueado.set(false);
    this.rolUsuario.set(''); // Limpiamos el rol
    this.router.navigate(['/login']);
  }

  /**
   * Verifica si hay un token en el localStorage.
   */
  estaLogueado(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  /**
   * Obtiene el token JWT del localStorage.
   */
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  /**
   * Centraliza la lógica para manejar una respuesta de autenticación exitosa.
   */
  private manejarRespuestaAutenticacion(token: string): void {
    localStorage.setItem('jwt_token', token);
    this.usuarioLogueado.set(true);
    this.decodificarToken(token);
  }

  /**
   * Decodifica el token JWT para extraer y almacenar el rol del usuario.
   */
  private decodificarToken(token: string): void {
    try {
      const payload: DecodedToken = jwtDecode(token);
      this.rolUsuario.set(payload.rol || ''); // Asigna el rol a la señal
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      this.rolUsuario.set(''); // En caso de error, el rol se queda vacío
    }
  }
}
