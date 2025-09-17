// RUTA: src/app/panel-control/servicios/paciente.service.ts

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Patient } from '../modelos/patient';
import { environment } from '../../environments/environment'; // 1. Importa el entorno

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  // La señal sigue siendo la fuente de verdad para tus componentes
  private pacientesSignal = signal<Patient[]>([]);
  public pacientes = this.pacientesSignal.asReadonly();

  // 2. Define la URL completa para el endpoint de pacientes
  private apiUrl = `${environment.apiUrl}/pacientes`;

  // 3. Inyecta HttpClient
  constructor(private http: HttpClient) {
    // 4. Al iniciar el servicio, carga los pacientes desde el backend
    this.cargarPacientes();
  }

  // MÉTODO PARA OBTENER TODOS LOS PACIENTES (GET)
  cargarPacientes(): void {
    this.http.get<Patient[]>(this.apiUrl).subscribe({
      next: (pacientesDesdeApi) => {
        // Cuando la petición es exitosa, actualiza la señal
        this.pacientesSignal.set(pacientesDesdeApi);
        console.log('Pacientes cargados desde la API:', pacientesDesdeApi);
      },
      error: (err) => {
        // En caso de error, deja la lista vacía y muestra el error en consola
        this.pacientesSignal.set([]);
        console.error('Error al cargar pacientes:', err);
      }
    });
  }

  // MÉTODO PARA REGISTRAR UN PACIENTE (POST)
  registrarPaciente(paciente: Omit<Patient, 'id'>) {
    this.http.post<Patient>(this.apiUrl, paciente).subscribe({
      next: (nuevoPaciente) => {
        // Después de crear, actualiza la lista local para reflejar el cambio
        this.pacientesSignal.update(pacientes => [...pacientes, nuevoPaciente]);
      },
      error: (err) => console.error('Error al registrar paciente:', err)
    });
  }

  // MÉTODO PARA ACTUALIZAR UN PACIENTE (PUT)
  actualizarPaciente(pacienteActualizado: Patient) {
    this.http.put<Patient>(`${this.apiUrl}/${pacienteActualizado.id}`, pacienteActualizado).subscribe({
      next: (pacienteRespuesta) => {
        // Actualiza la lista local con el paciente modificado
        this.pacientesSignal.update(pacientes =>
          pacientes.map(p => (p.id === pacienteRespuesta.id ? pacienteRespuesta : p))
        );
      },
      error: (err) => console.error('Error al actualizar paciente:', err)
    });
  }

  // MÉTODO PARA ELIMINAR UN PACIENTE (DELETE)
  eliminarPaciente(id: string) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        // Elimina el paciente de la lista local
        this.pacientesSignal.update(pacientes =>
          pacientes.filter(p => p.id !== id)
        );
      },
      error: (err) => console.error('Error al eliminar paciente:', err)
    });
  }
}