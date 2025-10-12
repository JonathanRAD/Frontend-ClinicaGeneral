import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReporteService } from '../../../../services/reporte';
import { CitaService } from '../../../../services/cita';
import { MatDialog } from '@angular/material/dialog';
import { DialogoPrevisualizacionComponent } from '../dialogo-previsualizacion/dialogo-previsualizacion';
import { MatMenuModule } from '@angular/material/menu'; 


@Component({
  selector: 'app-gestion-reportes',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './gestion-reportes.html',
  styleUrls: ['./gestion-reportes.css']
})
export class GestionReportesComponent {
  
  constructor(
    private reporteService: ReporteService,
    private citaService: CitaService,
    public dialog: MatDialog
  ) {}

  descargarReporteCitasCSV(): void {
    this.reporteService.generarReporteDeCitasCSV();
  }

  descargarReporteCitasXLSX(): void {
    this.reporteService.generarReporteDeCitasXLSX();
  }

  previsualizarReporteCitas(): void {
    const citas = this.citaService.citas().slice(0, 5);
    if (citas.length === 0) {
      alert('No hay datos para previsualizar.');
      return;
    }

    const headers = ['ID Cita', 'Fecha', 'Paciente', 'Médico', 'Estado'];
    const rows = citas.map(cita => [
      cita.id,
      new Date(cita.fechaHora).toLocaleString('es-ES'),
      `${cita.paciente.nombres} ${cita.paciente.apellidos}`,
      `Dr(a). ${cita.medico.nombres} ${cita.medico.apellidos}`,
      cita.estado
    ]);

    this.dialog.open(DialogoPrevisualizacionComponent, {
      width: '800px',
      disableClose: true,
      data: {
        titulo: 'Previsualización: Reporte General de Citas',
        headers: headers,
        rows: rows
      }
    });
  }
}