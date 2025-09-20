// RUTA: src/app/panel-control/servicios/reporte.service.ts

import { Injectable } from '@angular/core';
import { CitaService } from './cita';
import { Cita } from '../modelos/cita';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(private citaService: CitaService) { }

  /**
   * Genera y descarga un reporte de citas en formato CSV.
   */
  generarReporteDeCitasCSV(): void {
    const citas = this.citaService.citas(); // Obtenemos las citas del servicio
    
    if (citas.length === 0) {
      alert('No hay citas para generar un reporte.');
      return;
    }

    const cabeceras = [
      'ID Cita',
      'Fecha y Hora',
      'Estado',
      'Paciente',
      'DNI Paciente',
      'Medico',
      'Especialidad Medico',
      'Motivo'
    ];

    // Mapeamos los datos de las citas a un formato de texto plano
    const filas = citas.map(cita => [
      cita.id,
      new Date(cita.fechaHora).toLocaleString('es-ES'),
      cita.estado,
      `${cita.paciente.nombres} ${cita.paciente.apellidos}`,
      cita.paciente.dni,
      `${cita.medico.nombres} ${cita.medico.apellidos}`,
      cita.medico.especialidad,
      `"${cita.motivo.replace(/"/g, '""')}"` // Escapamos comillas en el motivo
    ].join(','));

    // Unimos cabeceras y filas
    const contenidoCSV = [cabeceras.join(','), ...filas].join('\n');
    
    // Creamos el archivo y lo descargamos
    const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const enlace = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    enlace.setAttribute('href', url);
    enlace.setAttribute('download', 'reporte_de_citas.csv');
    enlace.style.visibility = 'hidden';
    
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
  }
}