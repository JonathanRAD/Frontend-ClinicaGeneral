
import { Injectable } from '@angular/core';
import { CitaService } from './cita';
import * as ExcelJS from 'exceljs'; 
import { saveAs } from 'file-saver'; 

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(private citaService: CitaService) { }

  async generarReporteDeCitasXLSX(): Promise<void> {
    const citas = this.citaService.citas();
    if (citas.length === 0) {
      alert('No hay citas para generar un reporte.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ClínicaBienestar';
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet('Reporte de Citas');

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

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0D6EFD' } 
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' }, 
        bold: true,
        size: 12
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
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
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, 'Reporte_De_Citas.xlsx');
  }

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