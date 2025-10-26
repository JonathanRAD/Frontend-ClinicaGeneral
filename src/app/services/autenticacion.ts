// RUTA: src/app/services/autenticacion.ts
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Importar HttpErrorResponse
import { environment } from '../environments/environment';
import { tap, catchError } from 'rxjs/operators'; // Importar catchError
import { Observable, throwError } from 'rxjs'; // Importar throwError
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

interface PasswordResetPayload { // Nuevo
  email: string;
}

interface ResetPasswordPayload { // Nuevo
  token: string;
  newPassword: string;
}

interface DecodedToken {
  sub: string; // email
  rol: string;
  permisos: string[];
  iat: number;
  exp: number;
}

interface MensajeRespuesta { // Nuevo
    message: string;
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
    this.verificarTokenAlCargar(); // Simplificado
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
    return this.http.post<void>(`${this.apiUrl}/create-user`, payload).pipe(
      catchError(this.handleError) // Añadir manejo de errores
    );
  }


  login(email: string, contrasena: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password: contrasena })
      .pipe(
        tap(response => {
          this.manejarRespuestaAutenticacion(response.token);
          // La redirección se maneja en el componente ahora
        }),
        catchError(this.handleError) // Manejo de errores
      );
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload)
      .pipe(
        tap(response => {
          this.manejarRespuestaAutenticacion(response.token);
        }),
        catchError(this.handleError) // Manejo de errores
      );
  }

  // --- NUEVO MÉTODO ---
  solicitarReseteoContrasena(email: string): Observable<MensajeRespuesta> {
    const payload: PasswordResetPayload = { email };
    return this.http.post<MensajeRespuesta>(`${this.apiUrl}/request-password-reset`, payload).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  // --- NUEVO MÉTODO ---
  resetearContrasena(token: string, newPassword: string): Observable<MensajeRespuesta> {
    const payload: ResetPasswordPayload = { token, newPassword };
    return this.http.post<MensajeRespuesta>(`${this.apiUrl}/reset-password`, payload).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }
  // --- FIN NUEVOS MÉTODOS ---

  logout() {
    localStorage.removeItem('jwt_token');
    this.usuarioLogueado.set(false);
    this.rolUsuario.set('');
    this.permisosUsuario.set([]);
    this.router.navigate(['/login']);
  }

  estaLogueado(): boolean {
     const token = this.getToken();
     return !!token && !this.esTokenExpirado(token);
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
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  tienePermiso(permiso: string): boolean {
    // Asegurarse de que el usuario esté logueado y el token no haya expirado
    if (!this.estaLogueado()) {
        return false;
    }
    // Verificar si el rol es ADMINISTRADOR, en cuyo caso tiene todos los permisos
    if (this.rolUsuario() === 'ADMINISTRADOR') {
        return true;
    }
    // Verificar si el permiso específico está en la lista de permisos del usuario
    return this.permisosUsuario().includes(permiso);
}


  private manejarRespuestaAutenticacion(token: string): void {
    if (this.esTokenExpirado(token)) {
        console.error("Received expired token");
        this.logout(); // O manejar de otra forma
        return;
    }
    localStorage.setItem('jwt_token', token);
    this.usuarioLogueado.set(true);
    this.decodificarToken(token);
  }

  private esTokenExpirado(token: string): boolean {
    try {
      const payload: DecodedToken = jwtDecode(token);
      if (!payload.exp) return true; // Si no hay fecha de expiración, considerarlo inválido
      const fechaExpiracion = payload.exp * 1000;
      return fechaExpiracion < Date.now();
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // Considerar expirado si hay error al decodificar
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
       this.logout(); // Si el token es inválido, desloguear
    }
  }

   // --- NUEVO MÉTODO DE MANEJO DE ERRORES ---
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.status === 401 && error.error?.message) {
         errorMessage = error.error.message; // Mensaje de BadCredentials o Locked
      } else if (error.status === 400 && error.error?.message) {
          errorMessage = error.error.message; // Mensajes de validación o IllegalArgument
          // Podrías intentar extraer errores específicos de campos si el backend los devuelve estructurados
          if (error.error.errors && typeof error.error.errors === 'object') {
              const fieldErrors = Object.values(error.error.errors).join(' ');
              errorMessage += ` Detalles: ${fieldErrors}`;
          }
      } else if (error.status === 403) {
          errorMessage = "No tienes permiso para realizar esta acción.";
      } else {
         errorMessage = `Error ${error.status}: ${error.statusText}. ${error.error?.message || ''}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}