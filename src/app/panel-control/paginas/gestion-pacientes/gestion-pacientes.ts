// src/app/panel-control/paginas/gestion-pacientes/gestion-pacientes.ts
import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PacienteService } from '../../servicios/paciente';
import { Patient } from '../../modelos/patient';

import { TablaGenerica, ColumnConfig } from '../../../compartido/componentes/tabla-generica/tabla-generica';


@Component({
  selector: 'app-gestion-pacientes',
  standalone: true,
  imports: [CommonModule, RouterModule, TablaGenerica],
  templateUrl: './gestion-pacientes.html',
  styleUrls: ['./gestion-pacientes.css']
})
export class GestionPacientes {
  pacientes: Signal<Patient[]>;

  // Configuración específica para la tabla de pacientes
  columnasPacientes: ColumnConfig[] = [
    { name: 'dni', header: 'DNI' },
    { name: 'nombres', header: 'Nombres' },
    { name: 'apellidos', header: 'Apellidos' },
    { name: 'telefono', header: 'Teléfono' }
  ];

  constructor(
    private pacienteService: PacienteService,
    private router: Router // Inyectamos el Router
  ) {
    this.pacientes = this.pacienteService.pacientes;
  }

  // NUEVO MÉTODO para manejar el evento de agregar
  onAgregarPaciente() {
    this.router.navigate(['/panel/pacientes/nuevo']);
  }

  // Método que se activa cuando la tabla emite el evento 'onEdit'
  onEditarPaciente(paciente: Patient) {
    this.router.navigate(['/panel/pacientes/editar', paciente.id]);
  }

  // Método que se activa cuando la tabla emite el evento 'onDelete'
  onEliminarPaciente(paciente: Patient) {
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar a ${paciente.nombres} ${paciente.apellidos}?`);
    if (confirmacion) {
      this.pacienteService.eliminarPaciente(paciente.id);
    }
  }
}