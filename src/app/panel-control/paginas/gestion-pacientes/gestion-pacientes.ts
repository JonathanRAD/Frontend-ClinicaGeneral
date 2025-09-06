import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PacienteService } from '../../servicios/paciente';
import { Patient } from '../../modelos/patient';
import { TablaGenerica, ColumnConfig } from '../../../compartido/componentes/tabla-generica/tabla-generica';
import { MatDialog } from '@angular/material/dialog';
import { FormularioPaciente } from '../../componentes/formulario-paciente/formulario-paciente';
// Importa el componente del diálogo de confirmación que creaste
import { DialogoConfirmacion } from '../../componentes/dialogo-confirmacion/dialogo-confirmacion';

@Component({
  selector: 'app-gestion-pacientes',
  standalone: true,
  imports: [CommonModule, RouterModule, TablaGenerica],
  templateUrl: './gestion-pacientes.html',
  styleUrls: ['./gestion-pacientes.css']
})
export class GestionPacientes {
  pacientes: Signal<Patient[]>;
  columnasPacientes: ColumnConfig[] = [
    { name: 'dni', header: 'DNI' },
    { name: 'nombres', header: 'Nombres' },
    { name: 'apellidos', header: 'Apellidos' },
    { name: 'telefono', header: 'Teléfono' }
  ];

  constructor(
    private pacienteService: PacienteService,
    public dialog: MatDialog
  ) {
    this.pacientes = this.pacienteService.pacientes;
  }

  onAgregarPaciente() {
    const dialogRef = this.dialog.open(FormularioPaciente, {
      width: '600px',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: { esModoEdicion: false }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.pacienteService.registrarPaciente(resultado);
      }
    });
  }

  onEditarPaciente(paciente: Patient) {
    const dialogRef = this.dialog.open(FormularioPaciente, {
      width: '600px',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: { esModoEdicion: true, paciente: paciente }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.pacienteService.actualizarPaciente({ id: paciente.id, ...resultado });
      }
    });
  }

  // MÉTODO CORREGIDO: Este ya NO usa confirm()
  onEliminarPaciente(paciente: Patient) {
    const dialogRef = this.dialog.open(DialogoConfirmacion, {
      width: '450px',
      data: {
        titulo: 'Confirmar Eliminación',
        mensaje: `¿Estás seguro de que deseas eliminar a ${paciente.nombres} ${paciente.apellidos}? Esta acción no se puede deshacer.`
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      // Si el usuario hace clic en "Sí, Eliminar", el resultado será 'true'
      if (resultado) {
        this.pacienteService.eliminarPaciente(paciente.id);
      }
    });
  }
}

