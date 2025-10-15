// RUTA: src/app/services/autenticacion.ts

import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { CreateUserPayload } from '../core/models/usuario';

interface AuthResponse {
  token: string;
}

interface RegisterPayload {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
}

interface DecodedToken {
  sub: string;
  rol: string;
  permisos: string[];
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  usuarioLogueado = signal<boolean>(false);
  rolUsuario = signal<string>('');
  permisosUsuario = signal<string[]>([]);

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    const token = this.getToken();
    if (token) {
      this.verificarTokenAlCargar();
    }
  }

  private verificarTokenAlCargar(): void {
    const token = this.getToken();
    if (token) {
      if (this.esTokenExpirado(token)) {
        this.logout();
      } else {
        this.usuarioLogueado.set(true);
        this.decodificarToken(token);
      }
    }
  }

  crearUsuarioPorAdmin(payload: CreateUserPayload): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create-user`, payload);
  }

  login(email: string, contrasena: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password: contrasena })
      .pipe(
        tap(response => {
          this.manejarRespuestaAutenticacion(response.token);
          const rol = this.rolUsuario(); 
          if (rol === 'PACIENTE') {
            this.router.navigate(['/portal/mis-citas']); 
          } else {
            this.router.navigate(['/panel']);
          }
        })
      );
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload)
      .pipe(
        tap(response => {
          this.manejarRespuestaAutenticacion(response.token);
        })
      );
  }

  logout() {
    localStorage.removeItem('jwt_token');
    this.usuarioLogueado.set(false);
    this.rolUsuario.set(''); 
    this.permisosUsuario.set([]);
    this.router.navigate(['/login']);
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getNombreUsuario(): string | null {
    const token = this.getToken();
    if (token && !this.esTokenExpirado(token)) {
      try {
        const payload: DecodedToken = jwtDecode(token);
        return payload.sub; 
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  /**
   * @param permiso 
   */
  tienePermiso(permiso: string): boolean {
    return this.permisosUsuario().includes(permiso);
  }

  private manejarRespuestaAutenticacion(token: string): void {
    localStorage.setItem('jwt_token', token);
    this.usuarioLogueado.set(true);
    this.decodificarToken(token);
  }
  private esTokenExpirado(token: string): boolean {
    try {
      const payload: DecodedToken = jwtDecode(token);
      const fechaExpiracion = payload.exp * 1000;
      return fechaExpiracion < Date.now();
    } catch (error) {
      return true;
    }
  }

  private decodificarToken(token: string): void {
    try {
      const payload: DecodedToken = jwtDecode(token);
      this.rolUsuario.set(payload.rol || ''); 
      this.permisosUsuario.set(payload.permisos || []);
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      this.rolUsuario.set(''); 
      this.permisosUsuario.set([]);
    }
  }
}