// RUTA: src/app/panel-control/paginas/calendario-citas/calendario-citas.ts

import { Component, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CitaService } from '../../servicios/cita';
import { Cita } from '../../modelos/cita';
import { TablaGenerica, ColumnConfig } from '../../../compartido/tabla-generica/tabla-generica';
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
  citasParaVista: Signal<Cita[]>;

  columnasCitas: ColumnConfig[] = [
    { name: 'fechaHora', header: 'Fecha y Hora', isDate: true },
    { name: 'tiempoRestante', header: 'Tiempo Restante' }, // <-- NUEVA COLUMNA
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
    this.citasParaVista = computed(() => {
      const ahora = new Date();
      return this.citaService.citas()
        .map(cita => {
          const { tiempoRestante, alertaClase } = this.calcularTiempoRestante(new Date(cita.fechaHora), ahora);
          return { ...cita, tiempoRestante, alertaClase };
        })
        .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()); // Ordena por fecha
    });
  }
  private calcularTiempoRestante(fechaCita: Date, ahora: Date): { tiempoRestante: string, alertaClase: 'rojo' | 'ambar' | 'verde' } {
    const diffMs = fechaCita.getTime() - ahora.getTime();
    if (diffMs <= 0) {
      return { tiempoRestante: 'Pasada', alertaClase: 'rojo' };
    }

    const diffSegundos = diffMs / 1000;
    const diffMinutos = diffSegundos / 60;
    const diffHoras = diffMinutos / 60;
    const diffDias = diffHoras / 24;

    let tiempoRestante = '';
    let alertaClase: 'rojo' | 'ambar' | 'verde' = 'ambar';

    if (diffDias < 1) {
      tiempoRestante = `En ${Math.floor(diffHoras)} h`;
      alertaClase = 'rojo';
    } else if (diffDias < 7) {
      tiempoRestante = `En ${Math.floor(diffDias)} d`;
      alertaClase = 'ambar';
    } else {
      tiempoRestante = `En ${Math.floor(diffDias / 7)} sem`;
      alertaClase = 'verde';
    }

    return { tiempoRestante, alertaClase };
  }

  onAgregarCita() {
    const dialogRef = this.dialog.open(FormularioCita, {
      width: '600px',
      disableClose: true,
      panelClass: 'custom-dialog-container',
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
      panelClass: 'custom-dialog-container',
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