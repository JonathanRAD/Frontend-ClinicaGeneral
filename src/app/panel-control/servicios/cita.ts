// src/app/panel-control/servicios/cita.service.ts
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
    const pacienteEjemplo: Patient = { id: '1', dni: '12345678', nombres: 'Carlos', apellidos: 'Gomez', fechaNacimiento: new Date(), telefono: '987654321' };
    
    const citasIniciales: Cita[] = [
      {
        id: 'c1',
        fechaHora: new Date('2025-08-28T10:00:00'),
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
}