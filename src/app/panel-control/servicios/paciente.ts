// src/app/panel-control/servicios/paciente.service.ts
import { Injectable, signal } from '@angular/core';
import { Patient } from './../modelos/patient'; // Asegúrate de que la ruta al modelo sea correcta

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  // Usamos una señal para que la lista sea reactiva
  private pacientesSignal = signal<Patient[]>([]);


  // Hacemos pública una versión de solo lectura de la señal
  public pacientes = this.pacientesSignal.asReadonly();

  constructor() {
    // Datos de ejemplo para empezar
    const pacientesIniciales: Patient[] = [
      { id: '1', dni: '12345678', nombres: 'Carlos', apellidos: 'Gomez', fechaNacimiento: new Date(), telefono: '987654321' },
      { id: '2', dni: '87654321', nombres: 'Ana', apellidos: 'Martinez', fechaNacimiento: new Date(), telefono: '912345678' }
    ];
    this.pacientesSignal.set(pacientesIniciales);
  }

  getPacientePorId(id: string): Patient | undefined {
    // Busca en la señal actual de pacientes
    return this.pacientes().find(p => p.id === id);
  }

  actualizarPaciente(pacienteActualizado: Patient) {
    this.pacientesSignal.update(pacientes => 
      pacientes.map(p => 
        p.id === pacienteActualizado.id ? pacienteActualizado : p
      )
    );
    console.log('Paciente actualizado. Lista actual:', this.pacientes());
  }

  registrarPaciente(paciente: Omit<Patient, 'id'>) {
    const nuevoPaciente: Patient = {
      id: crypto.randomUUID(),
      ...paciente
    };

    // Actualizamos la señal añadiendo el nuevo paciente a la lista
    this.pacientesSignal.update(pacientesActuales => [...pacientesActuales, nuevoPaciente]);
    console.log('Pacientes actuales:', this.pacientes());
  }
  eliminarPaciente(id: string) {
    // Actualizamos la señal, filtrando y quedándonos con todos los pacientes
    // cuyo ID sea diferente al que queremos eliminar.
    this.pacientesSignal.update(pacientes => 
      pacientes.filter(p => p.id !== id)
    );
    console.log('Paciente eliminado. Lista actual:', this.pacientes());
  }
}