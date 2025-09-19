import { Component, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PacienteService } from '../../servicios/paciente';
import { Patient } from '../../modelos/patient';
import { TablaGenerica, ColumnConfig } from '../../../compartido/tabla-generica/tabla-generica';
import { MatDialog } from '@angular/material/dialog';
import { FormularioPaciente } from '../../componentes/formulario-paciente/formulario-paciente';
// Importa el componente del diálogo de confirmación que creaste
import { DialogoConfirmacion } from '../../componentes/dialogo-confirmacion/dialogo-confirmacion';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface PacienteConCalculos extends Patient {
  imc?: number;
}

@Component({
  selector: 'app-gestion-pacientes',
  standalone: true,
  imports: [CommonModule, RouterModule, TablaGenerica],
  templateUrl: './gestion-pacientes.html',
  styleUrls: ['./gestion-pacientes.css']
})
export class GestionPacientes {
  pacientesParaVista: Signal<PacienteConCalculos[]>;

  columnasPacientes: ColumnConfig[] = [
    { name: 'dni', header: 'DNI' },
    { name: 'nombres', header: 'Nombres' },
    { name: 'apellidos', header: 'Apellidos' },
    { name: 'telefono', header: 'Teléfono' },
    // --- NUEVAS COLUMNAS ---
    { name: 'ritmoCardiaco', header: 'Ritmo Cardíaco' },
    { name: 'imc', header: 'IMC' }
  ];

  constructor(
    private pacienteService: PacienteService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar 

  ) {
    this.pacientesParaVista = computed(() => {
      return this.pacienteService.pacientes().map(paciente => {
        const imc = this.calcularIMC(paciente.peso, paciente.altura);
        // Devuelve un nuevo objeto que extiende el paciente y añade el IMC
        return { ...paciente, imc: imc };
      });
    });
  }
  private calcularIMC(peso?: number, altura?: number): number | undefined {
    if (peso && altura && altura > 0) {
      // Fórmula del IMC: peso / (altura * altura)
      const imc = peso / (altura * altura);
      // Redondea a 2 decimales
      return parseFloat(imc.toFixed(2));
    }
    return undefined;
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
        this.snackBar.open('Paciente registrado con éxito', 'Cerrar', { duration: 3000 });

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
        this.snackBar.open('Paciente actualizado correctamente', 'Cerrar', { duration: 3000 });

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
        this.snackBar.open('Paciente eliminado', 'Cerrar', { duration: 3000 });

      }
    });
  }
}

