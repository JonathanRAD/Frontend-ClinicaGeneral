// src/app/panel-control/servicios/medico.service.ts
import { Injectable, signal } from '@angular/core';
import { Medico } from '../modelos/medico';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private medicosSignal = signal<Medico[]>([]);
  public medicos = this.medicosSignal.asReadonly();

  constructor() {
    // Datos de ejemplo
    const medicosIniciales: Medico[] = [
      { id: 'm1', nombres: 'Ana', apellidos: 'Lopez', especialidad: 'Medicina General' },
      { id: 'm2', nombres: 'Luis', apellidos: 'Paredes', especialidad: 'Cardiología' },
      { id: 'm3', nombres: 'Sofia', apellidos: 'Castro', especialidad: 'Pediatría' }
    ];
    this.medicosSignal.set(medicosIniciales);
  }
}