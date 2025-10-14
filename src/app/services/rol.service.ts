import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Role } from '../core/models/rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los roles disponibles desde el backend.
   * Esto se usará para poblar los checkboxes en el formulario de usuario.
   * @returns Un Observable con un array de Roles.
   */
  obtenerTodosLosRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }
}