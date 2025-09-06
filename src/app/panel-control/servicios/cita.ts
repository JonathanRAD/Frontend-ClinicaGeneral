import { Injectable, signal } from '@angular/core';
import { Cita } from '../modelos/cita';
import { Medico } from '../modelos/medico';
import { Patient } from '../modelos/patient';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private citasSignal = signal<Cita[]>([]);
  public citas = this.citasSignal.asReadonly();

  constructor() {
    // Datos de ejemplo para empezar
    const medicoEjemplo: Medico = { id: 'm1', nombres: 'Ana', apellidos: 'Lopez', especialidad: 'Medicina General' };
    const pacienteEjemplo: Patient = { id: '1', dni: '12345678', nombres: 'Carlos', apellidos: 'Gomez', fechaNacimiento: new Date('1985-05-15'), telefono: '987654321' };
    
    const citasIniciales: Cita[] = [
      {
        id: 'c1',
        fechaHora: new Date('2025-09-28T10:00:00'),
        paciente: pacienteEjemplo,
        medico: medicoEjemplo,
        motivo: 'Control de rutina',
        estado: 'programada'
      }
    ];
    this.citasSignal.set(citasIniciales);
  }

  agendarCita(nuevaCita: Omit<Cita, 'id'>) {
    const cita: Cita = { id: crypto.randomUUID(), ...nuevaCita };
    this.citasSignal.update(citasActuales => [...citasActuales, cita]);
  }

  // --- NUEVO MÉTODO AÑADIDO ---
  eliminarCita(id: string) {
    // Actualizamos la señal, filtrando la cita que coincida con el ID
    this.citasSignal.update(citas => 
      citas.filter(c => c.id !== id)
    );
  }
}
