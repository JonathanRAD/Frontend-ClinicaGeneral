import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { UserProfile } from '../core/models/usuario'; 

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  obtenerTodosLosUsuarios(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.apiUrl}/usuarios`);
  }


  obtenerMiPerfil(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/usuarios/me`);
  }

  /**
   * @param datosUsuario 
   */
  crearUsuario(datosUsuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios`, datosUsuario);
  }

  /**
   * 
   * @param id - 
   * @param datosUsuario 
   */
  actualizarUsuario(id: number, datosUsuario: any): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/usuarios/${id}`, datosUsuario);
  }

  /**
   * 
   * @param id 
   */
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`);
  }
}