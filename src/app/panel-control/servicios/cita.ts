// RUTA: src/app/panel-control/servicios/cita.service.ts

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cita } from '../modelos/cita';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private citasSignal = signal<Cita[]>([]);
  public citas = this.citasSignal.asReadonly();
  
  private apiUrl = `${environment.apiUrl}/citas`;

  constructor(private http: HttpClient) {
    this.cargarCitasPanel();
  }

  getMisCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/mis-citas`);
  }

  /**
   * @param payload
   */
  agendarCita(payload: { medicoId: number; fechaHora: string; motivo: string }): Observable<Cita> {
    return this.http.post<Cita>(`${this.apiUrl}/agendar`, payload);
  }


  cargarCitasPanel(): void {
    this.http.get<Cita[]>(this.apiUrl).subscribe({
      next: (citasDesdeApi) => this.citasSignal.set(citasDesdeApi),
      error: (err) => {
        this.citasSignal.set([]);
        console.error('Error al cargar citas para el panel:', err);
      }
    });
  }
   // --- NUEVO MÉTODO PARA CANCELAR CITA DESDE EL PORTAL ---
  /**
   * Envía la solicitud para cancelar una cita del paciente autenticado.
   * @param id El ID de la cita a cancelar.
   */
  cancelarMiCita(id: string): Observable<void> { // <-- Cambiado a 'string'
    return this.http.delete<void>(`${this.apiUrl}/mis-citas/${id}`);
  }

  /**
   * @param payload 
   */
  crearCitaPanel(payload: any): Observable<Cita> {
    return this.http.post<Cita>(this.apiUrl, payload).pipe(
      tap(nuevaCita => {
        this.citasSignal.update(citas => [...citas, nuevaCita]);
      })
    );
  }

  /**
   * @param id 
   * @param payload 
   */
  actualizarCitaPanel(id: any, payload: any): Observable<Cita> {
    return this.http.put<Cita>(`${this.apiUrl}/${id}`, payload).pipe(
      tap(citaActualizada => {
        this.citasSignal.update(citas =>
          citas.map(c => (c.id === citaActualizada.id ? citaActualizada : c))
        );
      })
    );
  }
  

  /**
   * @param id 
   */
  eliminarCitaPanel(id: any): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.citasSignal.update(citas =>
          citas.filter(c => c.id !== id)
        );
      })
    );
  }
}

