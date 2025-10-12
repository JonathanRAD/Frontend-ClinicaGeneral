// RUTA: src/app/panel-control/componentes/dialogo-confirmacion/dialogo-confirmacion.ts

import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialogo-confirmacion',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './dialogo-confirmacion.html',
  styleUrls: ['./dialogo-confirmacion.css']
})
export class DialogoConfirmacion {
  // Inyectamos los datos (título y mensaje) que se le pasan al abrirlo
  constructor(
    public dialogRef: MatDialogRef<DialogoConfirmacion>,
    @Inject(MAT_DIALOG_DATA) public data: { titulo: string; mensaje: string }
  ) {}

  // Función para el botón "Cancelar"
  onNoClick(): void {
    this.dialogRef.close();
  }
}