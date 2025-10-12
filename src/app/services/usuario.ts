import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { Rol } from '../core/models/rol';
// --- CORRECCIÓN CLAVE ---
import { UserProfile, ChangePasswordPayload, CreateUserPayload } from './../core/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuarios`;
  
  private usuariosSignal = signal<UserProfile[]>([]);
  public usuarios = this.usuariosSignal.asReadonly();

  constructor(private http: HttpClient) { }

  getMiPerfil(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }

  getAllUsuarios(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(this.apiUrl).pipe(
      tap(usuarios => this.usuariosSignal.set(usuarios))
    );
  }

  crearUsuario(payload: CreateUserPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}`, payload).pipe(
      tap(() => this.getAllUsuarios().subscribe())
    );
  }

  actualizarUsuario(id: number, payload: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${id}`, payload).pipe(
      tap(() => this.getAllUsuarios().subscribe())
    );
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.getAllUsuarios().subscribe())
    );
  }

  actualizarPerfil(perfil: UserProfile): Observable<UserProfile> {
    console.log('Actualizando perfil (simulado):', perfil);
    return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }

  cambiarContrasena(payload: ChangePasswordPayload): Observable<any> {
    console.log('Cambiando contraseña (simulado)');
    return new Observable(observer => {
      observer.next({ message: 'Contraseña actualizada con éxito' });
      observer.complete();
    });
  }
}