// RUTA: src/app/panel-control/servicios/cita.service.ts

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cita } from '../modelos/cita';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private citasSignal = signal<Cita[]>([]);
  public citas = this.citasSignal.asReadonly();
  private apiUrl = `${environment.apiUrl}/citas`;

  constructor(private http: HttpClient) {
    this.cargarCitas();
  }

  /**
   * Obtiene todas las citas desde la API.
   */
  cargarCitas(): void {
    this.http.get<Cita[]>(this.apiUrl).subscribe({
      next: (citasDesdeApi) => this.citasSignal.set(citasDesdeApi),
      error: (err) => {
        this.citasSignal.set([]);
        console.error('Error al cargar citas:', err);
      }
    });
  }

  /**
   * Envía una nueva cita al backend para ser creada.
   * @param payload El objeto con los datos de la cita.
   */
  agendarCita(payload: any) {
    this.http.post<Cita>(this.apiUrl, payload).subscribe({
      next: (nuevaCita) => {
        this.citasSignal.update(citas => [...citas, nuevaCita]);
      },
      error: (err) => console.error('Error al agendar cita:', err)
    });
  }

  /**
   * Envía los datos de una cita actualizada al backend.
   * @param id El ID de la cita a actualizar.
   * @param payload Los nuevos datos de la cita.
   */
  actualizarCita(id: any, payload: any) {
    this.http.put<Cita>(`${this.apiUrl}/${id}`, payload).subscribe({
      next: (citaActualizada) => {
        this.citasSignal.update(citas =>
          citas.map(c => (c.id === citaActualizada.id ? citaActualizada : c))
        );
      },
      error: (err) => console.error('Error al actualizar cita:', err)
    });
  }

  /**
   * Solicita al backend que elimine una cita por su ID.
   * @param id El ID de la cita a eliminar.
   */
  eliminarCita(id: any) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.citasSignal.update(citas =>
          citas.filter(c => c.id !== id)
        );
      },
      error: (err) => console.error('Error al eliminar cita:', err)
    });
  }
}