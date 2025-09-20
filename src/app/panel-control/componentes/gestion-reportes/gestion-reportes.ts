// RUTA: src/app/panel-control/paginas/gestion-reportes/gestion-reportes.ts

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReporteService } from '../../servicios/reporte';

@Component({
  selector: 'app-gestion-reportes',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './gestion-reportes.html',
})
export class GestionReportesComponent {
  
  constructor(private reporteService: ReporteService) {}

  descargarReporteCitas(): void {
    this.reporteService.generarReporteDeCitasCSV();
  }
}