// RUTA: src/app/panel-control/paginas/gestion-facturacion/gestion-facturacion.ts

import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacturacionService, FacturaPayload } from '../../servicios/facturacion';
import { Factura } from '../../modelos/factura';
import { TablaGenerica, ColumnConfig } from '../../../compartido/componentes/tabla-generica/tabla-generica';
import { DialogoConfirmacion } from '../../componentes/dialogo-confirmacion/dialogo-confirmacion';
import { FormularioFacturacion } from '../../componentes/formulario-facturacion/formulario-facturacion';

@Component({
  selector: 'app-gestion-facturacion',
  standalone: true,
  imports: [CommonModule, TablaGenerica],
  templateUrl: './gestion-facturacion.html',
  styleUrls: ['./gestion-facturacion.css']
})
export class GestionFacturacion {
  facturas: Signal<Factura[]>;
  columnasFacturacion: ColumnConfig[] = [
    { name: 'cita.paciente.nombres', header: 'Paciente' },
    { name: 'fechaEmision', header: 'Fecha de Emisión', isDate: true },
    { name: 'monto', header: 'Monto (S/)' },
    { name: 'estado', header: 'Estado' },
  ];

  constructor(
    private facturacionService: FacturacionService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.facturas = this.facturacionService.facturas;
  }

  onAgregarFactura() {
    const dialogRef = this.dialog.open(FormularioFacturacion, {
      width: '500px',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: { esModoEdicion: false }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        const payload: FacturaPayload = {
          citaId: resultado.citaId,
          monto: resultado.monto,
          estado: resultado.estado
        };
        this.facturacionService.registrarFactura(payload);
        this.snackBar.open('Factura registrada con éxito', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onEditarFactura(factura: Factura) {
    const dialogRef = this.dialog.open(FormularioFacturacion, {
      width: '500px',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: { esModoEdicion: true, factura: factura }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        const payload: FacturaPayload = {
            citaId: resultado.citaId,
            monto: resultado.monto,
            estado: resultado.estado
        };
        this.facturacionService.actualizarFactura(factura.id, payload);
        this.snackBar.open('Factura actualizada correctamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onEliminarFactura(factura: Factura) {
    const dialogRef = this.dialog.open(DialogoConfirmacion, {
      width: '450px',
      data: {
        titulo: 'Anular Factura',
        mensaje: `¿Estás seguro de anular la factura para ${factura.cita.paciente.nombres}?`
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.facturacionService.eliminarFactura(factura.id);
        this.snackBar.open('Factura anulada correctamente', 'Cerrar', { duration: 3000 });
      }
    });
  }
}