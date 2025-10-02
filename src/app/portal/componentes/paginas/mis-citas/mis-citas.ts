import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CitaService } from '../../../../panel-control/servicios/cita';
import { Cita } from '../../../../panel-control/modelos/cita';
import { Spinner } from '../../../../compartido/spinner/spinner';
import { RouterModule } from '@angular/router';
import { DialogoConfirmacion } from '../../../../panel-control/componentes/dialogo-confirmacion/dialogo-confirmacion';
import { MatDialog } from '@angular/material/dialog';
import { Notificacion } from '../../../../core/servicios/notificacion';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, DatePipe, Spinner, RouterModule], // DialogoConfirmacion no se importa aquí
  templateUrl: './mis-citas.html',
  styleUrls: ['./mis-citas.css']
})
export class MisCitas implements OnInit {
  citas = signal<Cita[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    private citaService: CitaService,
    private dialog: MatDialog, 
    private notificacion: Notificacion
  ) {}

  ngOnInit(): void {
    this.cargarMisCitas();
  }

  cargarMisCitas(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.citaService.getMisCitas().subscribe({
      next: (data: Cita[]) => {
        this.citas.set(data);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar las citas:', err);
        this.error.set('No se pudieron cargar tus citas. Por favor, intenta más tarde.');
        this.cargando.set(false);
      }
    });
  }
  
  confirmarCancelacion(cita: Cita): void {
    const dialogRef = this.dialog.open(DialogoConfirmacion, {
      width: '450px',
      data: {
        titulo: 'Cancelar Cita',
        mensaje: `¿Estás seguro de que deseas cancelar tu cita con el Dr(a). ${cita.medico.apellidos} para el ${new Date(cita.fechaHora).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}?`
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.cancelarCita(cita.id);
      }
    });
  }

  // --- INICIO DE LA CORRECCIÓN ---
  // Cambiamos el tipo de 'id' de number a string para que coincida con el modelo Cita.
  cancelarCita(id: string): void { 
  // --- FIN DE LA CORRECCIÓN ---
    this.citaService.cancelarMiCita(id).subscribe({
      next: () => {
        // La lógica de comparación (c.id !== id) ahora es correcta (string vs string)
        this.citas.update(citasActuales => citasActuales.filter(c => c.id !== id));
        this.notificacion.mostrar('Cita cancelada con éxito');
      },
      error: () => {
        this.notificacion.mostrar('No se pudo cancelar la cita. Inténtalo de nuevo.', 'error');
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'programada': return 'badge bg-primary';
      case 'confirmada': return 'badge bg-success';
      case 'cancelada': return 'badge bg-danger';
      case 'completada': return 'badge bg-secondary';
      default: return 'badge bg-light text-dark';
    }
  }
}