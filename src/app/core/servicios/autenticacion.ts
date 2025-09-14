// RUTA: src/app/core/servicios/autenticacion.ts

import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Interfaz para la respuesta que esperamos del backend
interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private apiUrl = `${environment.apiUrl}/auth`;
  // La señal ahora se basará en la existencia de un token
  usuarioLogueado = signal<boolean>(this.estaLogueado());

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  // El método login ahora devuelve un Observable porque es asíncrono
  login(usuario: string, contrasena: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email: usuario, password: contrasena })
      .pipe(
        tap(response => {
          // Si el login es exitoso, guardamos el token
          localStorage.setItem('jwt_token', response.token);
          this.usuarioLogueado.set(true);
        })
      );
  }
  
  // Nuevo método para registrar un usuario
  register(usuario: string, contrasena: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email: usuario, password: contrasena })
    .pipe(
      tap(response => {
        localStorage.setItem('jwt_token', response.token);
        this.usuarioLogueado.set(true);
      })
    );
  }

  // El método para cerrar sesión ahora también borra el token
  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('usuarioLogueado'); // Mantenemos la limpieza de la lógica anterior por si acaso
    this.usuarioLogueado.set(false);
    this.router.navigate(['/login']);
  }

  // Ahora, "estar logueado" significa tener un token
  estaLogueado(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  // Nuevo método para obtener el token, que usará el interceptor
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
}