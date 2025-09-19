// RUTA: src/app/core/servicios/autenticacion.ts

import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface AuthResponse {
  token: string;
}

// Interfaz para el payload de registro
interface RegisterPayload {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private apiUrl = `${environment.apiUrl}/auth`;
  usuarioLogueado = signal<boolean>(this.estaLogueado());

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  login(email: string, contrasena: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email: email, password: contrasena })
      .pipe(
        tap(response => {
          localStorage.setItem('jwt_token', response.token);
          this.usuarioLogueado.set(true);
        })
      );
  }
  
  // --- MÉTODO REGISTER ACTUALIZADO ---
  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload)
    .pipe(
      tap(response => {
        localStorage.setItem('jwt_token', response.token);
        this.usuarioLogueado.set(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('jwt_token');
    this.usuarioLogueado.set(false);
    this.router.navigate(['/login']);
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
}