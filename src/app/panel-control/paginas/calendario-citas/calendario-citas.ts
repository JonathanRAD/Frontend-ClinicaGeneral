// RUTA: src/app/panel-control/paginas/calendario-citas/calendario-citas.ts

import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CitaService } from '../../servicios/cita';
import { Cita } from '../../modelos/cita';
import { TablaGenerica, ColumnConfig } from '../../../compartido/componentes/tabla-generica/tabla-generica';
import { DialogoConfirmacion } from '../../componentes/dialogo-confirmacion/dialogo-confirmacion';
import { FormularioCita } from '../../componentes/formulario-cita/formulario-cita';

@Component({
  selector: 'app-calendario-citas',
  standalone: true,
  imports: [CommonModule, RouterModule, TablaGenerica],
  templateUrl: './calendario-citas.html',
  styleUrls: ['./calendario-citas.css']
})
export class CalendarioCitas {
  citas: Signal<Cita[]>;
  columnasCitas: ColumnConfig[] = [
    { name: 'fechaHora', header: 'Fecha y Hora', isDate: true },
    { name: 'paciente.nombres', header: 'Paciente' },
    { name: 'medico.nombres', header: 'Médico' },
    { name: 'motivo', header: 'Motivo' },
    { name: 'estado', header: 'Estado' }
  ];

  constructor(
    private citaService: CitaService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.citas = this.citaService.citas;
  }

  onAgregarCita() {
    const dialogRef = this.dialog.open(FormularioCita, {
      width: '600px',
      disableClose: true,
      data: { esModoEdicion: false }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        // 'resultado' viene del formulario modal. Lo usamos para llamar al servicio.
        this.citaService.agendarCita(resultado);
        this.snackBar.open('Cita agendada con éxito', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onEditarCita(cita: Cita) {
    const dialogRef = this.dialog.open(FormularioCita, {
      width: '600px',
      disableClose: true,
      data: { esModoEdicion: true, cita: cita }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        // Enviamos el ID de la cita y los nuevos datos del formulario.
        this.citaService.actualizarCita(cita.id, resultado);
        this.snackBar.open('Cita actualizada correctamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onEliminarCita(cita: Cita) {
    const dialogRef = this.dialog.open(DialogoConfirmacion, {
      width: '450px',
      data: {
        titulo: 'Cancelar Cita',
        mensaje: `¿Estás seguro de que deseas cancelar la cita de ${cita.paciente.nombres} ${cita.paciente.apellidos}?`
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.citaService.eliminarCita(cita.id);
        this.snackBar.open('Cita cancelada', 'Cerrar', { duration: 3000 });
      }
    });
  }
}