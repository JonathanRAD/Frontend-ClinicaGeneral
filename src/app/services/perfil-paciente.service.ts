import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Patient } from '../core/models/patient';

@Injectable({
  providedIn: 'root'
})
export class PerfilPacienteService {
  // La URL base apunta DIRECTAMENTE al endpoint de "mi-perfil"
  private apiUrl = `${environment.apiUrl}/pacientes/mi-perfil`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene los datos del perfil del paciente autenticado.
   * Llama a: GET /api/pacientes/mi-perfil
   */
  getMiPerfil(): Observable<Patient> {
    return this.http.get<Patient>(this.apiUrl);
  }

  /**
   * Actualiza los datos del perfil del paciente autenticado.
   * @param perfil El objeto Patient con los datos actualizados.
   * Llama a: PUT /api/pacientes/mi-perfil
   */
  actualizarMiPerfil(perfil: Patient): Observable<Patient> {
    // La petición PUT va a la URL base, sin añadir ningún ID.
    return this.http.put<Patient>(this.apiUrl, perfil);
  }
}