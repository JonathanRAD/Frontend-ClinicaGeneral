import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { environment } from '../environments/environment';

// Interfaz para el token decodificado
interface DecodedToken {
  sub: string; // Correo del usuario
  id: number;
  nombres: string;
  apellidos: string;
  roles: string[];
  authorities: string[]; // Permisos
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject: BehaviorSubject<DecodedToken | null>;

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    this.currentUserSubject = new BehaviorSubject<DecodedToken | null>(token ? this.decodeToken(token) : null);
  }

  // --- MÉTODOS PÚBLICOS DE ACCIÓN ---

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => this.handleAuthentication(response.token))
    );
  }

  register(userInfo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userInfo).pipe(
      tap((response: any) => this.handleAuthentication(response.token))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // --- MÉTODOS PÚBLICOS DE ESTADO Y AUTORIZACIÓN ---

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const decoded = this.decodeToken(token);
    if (!decoded) return false;
    return decoded.exp * 1000 > Date.now();
  }

  getCurrentUser(): DecodedToken | null {
    return this.currentUserSubject.value;
  }
  
  // --- CORRECCIÓN: getToken() AHORA ES PÚBLICO ---
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  tieneRol(rol: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(rol.toUpperCase()) ?? false;
  }

  tienePermiso(permiso: string): boolean {
    const user = this.getCurrentUser();
    return user?.authorities?.includes(permiso.toUpperCase()) ?? false;
  }

  // --- MÉTODOS PRIVADOS ---

  private handleAuthentication(token: string): void {
    localStorage.setItem('token', token);
    const decodedToken = this.decodeToken(token);
    this.currentUserSubject.next(decodedToken);
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error("Token inválido, cerrando sesión.", error);
      this.logout();
      return null;
    }
  }
}