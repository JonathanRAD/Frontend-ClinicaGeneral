import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CitaService } from '../../servicios/cita';
import { Cita } from '../../modelos/cita';
import { TablaGenerica, ColumnConfig } from '../../../compartido/componentes/tabla-generica/tabla-generica';
// 1. Importa MatDialog y el componente de confirmación
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacion } from '../../componentes/dialogo-confirmacion/dialogo-confirmacion';


@Component({
  selector: 'app-calendario-citas',
  standalone: true,
  imports: [CommonModule, RouterModule, TablaGenerica ],
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
    private router: Router,
    public dialog: MatDialog // 2. Inyecta MatDialog
  ) {
    this.citas = this.citaService.citas;
  }

  onAgregarCita() {
    // Navegación para crear una nueva cita (esto puede ser un modal en el futuro)
    this.router.navigate(['/panel/citas/nueva']);
  }

  onEditarCita(cita: Cita) {
    // Lógica futura para editar una cita, posiblemente con un modal
    console.log('Editar cita:', cita);
    alert('La funcionalidad para editar citas se implementará próximamente.');
  }

  // 3. Modifica este método para usar el diálogo
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
      }
    });
  }
}
