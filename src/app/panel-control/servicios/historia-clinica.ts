import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HistoriaClinica } from '../modelos/historia-clinica';
import { Consulta } from '../modelos/consulta';

@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaService {
  private apiUrl = `${environment.apiUrl}/historias`;

  constructor(private http: HttpClient) { }

  // --- NUEVO MÉTODO PARA EL PORTAL DEL PACIENTE ---
  /**
   * Obtiene la historia clínica completa del paciente autenticado.
   * Llama al endpoint: GET /api/historias/mi-historial
   */
  getMiHistorial(): Observable<HistoriaClinica> {
    return this.http.get<HistoriaClinica>(`${this.apiUrl}/mi-historial`);
  }
  
  // --- MÉTODOS EXISTENTES PARA EL PANEL DE CONTROL (CON TIPOS CORREGIDOS) ---

  /**
   * Obtiene la historia clínica de un paciente específico por su ID.
   * Usado en el panel de control.
   */
  getHistoriaPorPacienteId(pacienteId: string): Observable<HistoriaClinica> {
    return this.http.get<HistoriaClinica>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  /**
   * Actualiza los datos generales de una historia clínica.
   * @param id El ID de la historia clínica.
   * @param datos Los campos a actualizar.
   */
  // --- CORRECCIÓN: Se cambia 'id: number' a 'id: string | number' ---
  actualizarHistoria(id: string | number, datos: Partial<HistoriaClinica>): Observable<HistoriaClinica> {
    return this.http.put<HistoriaClinica>(`${this.apiUrl}/${id}`, datos);
  }

  /**
   * Agrega una nueva consulta a una historia clínica existente.
   * @param historiaId El ID de la historia clínica.
   * @param consultaData Los datos de la nueva consulta.
   */
  // --- CORRECCIÓN: Se cambia 'historiaId: number' a 'historiaId: string | number' ---
  agregarConsulta(historiaId: string | number, consultaData: any): Observable<Consulta> {
    return this.http.post<Consulta>(`${this.apiUrl}/${historiaId}/consultas`, consultaData);
  }
}