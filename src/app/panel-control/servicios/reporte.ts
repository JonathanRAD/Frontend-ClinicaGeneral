// RUTA: src/app/panel-control/servicios/reporte.ts

import { Injectable } from '@angular/core';
import { CitaService } from './cita';
import * as ExcelJS from 'exceljs'; // Importamos la librería para Excel con estilos
import { saveAs } from 'file-saver'; // Importamos el file-saver para la descarga

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(private citaService: CitaService) { }

  /**
   * Genera y descarga un reporte de citas en formato XLSX (Excel) con estilos.
   */
  async generarReporteDeCitasXLSX(): Promise<void> {
    const citas = this.citaService.citas();
    if (citas.length === 0) {
      alert('No hay citas para generar un reporte.');
      return;
    }

    // 1. Crear un nuevo libro de trabajo (Workbook)
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ClínicaBienestar';
    workbook.created = new Date();
    workbook.modified = new Date();

    // 2. Añadir una nueva hoja de cálculo
    const worksheet = workbook.addWorksheet('Reporte de Citas');

    // 3. Definir las columnas y sus propiedades (header, key, width)
    worksheet.columns = [
      { header: 'ID Cita', key: 'id', width: 10 },
      { header: 'Fecha y Hora', key: 'fechaHora', width: 22, style: { numFmt: 'dd/mm/yyyy hh:mm:ss' } },
      { header: 'Paciente', key: 'paciente', width: 35 },
      { header: 'DNI Paciente', key: 'dni', width: 15 },
      { header: 'Médico', key: 'medico', width: 35 },
      { header: 'Especialidad', key: 'especialidad', width: 20 },
      { header: 'Estado', key: 'estado', width: 15 },
      { header: 'Motivo', key: 'motivo', width: 50 }
    ];

    // 4. Añadir estilo a la fila de encabezados
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0D6EFD' } // Azul primario
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' }, // Letra blanca
        bold: true,
        size: 12
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // 5. Mapear y añadir los datos de las citas a la hoja
    const datosParaExcel = citas.map(cita => ({
      id: cita.id,
      fechaHora: new Date(cita.fechaHora),
      paciente: `${cita.paciente.nombres} ${cita.paciente.apellidos}`,
      dni: cita.paciente.dni,
      medico: `Dr(a). ${cita.medico.nombres} ${cita.medico.apellidos}`,
      especialidad: cita.medico.especialidad,
      estado: cita.estado,
      motivo: cita.motivo
    }));

    worksheet.addRows(datosParaExcel);

    // 6. Añadir bordes a TODAS las celdas (encabezado y datos)
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // 7. Generar el buffer del archivo y descargarlo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, 'Reporte_De_Citas.xlsx');
  }

  /**
   * Genera y descarga un reporte de citas en formato CSV.
   */
  generarReporteDeCitasCSV(): void {
    const citas = this.citaService.citas();
    if (citas.length === 0) {
      alert('No hay citas para generar un reporte.');
      return;
    }

    const cabeceras = ['ID Cita', 'Fecha y Hora', 'Estado', 'Paciente', 'DNI Paciente', 'Medico', 'Especialidad Medico', 'Motivo'];
    const filas = citas.map(cita => [
      cita.id,
      new Date(cita.fechaHora).toLocaleString('es-ES'),
      cita.estado,
      `${cita.paciente.nombres} ${cita.paciente.apellidos}`,
      cita.paciente.dni,
      `${cita.medico.nombres} ${cita.medico.apellidos}`,
      cita.medico.especialidad,
      `"${cita.motivo.replace(/"/g, '""')}"`
    ].join(','));

    const contenidoCSV = [cabeceras.join(','), ...filas].join('\n');
    const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'reporte_de_citas.csv');
  }
}