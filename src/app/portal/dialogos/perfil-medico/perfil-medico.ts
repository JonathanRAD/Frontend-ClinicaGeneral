// RUTA: src/app/portal/componentes/dialogos/perfil-medico/perfil-medico.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Medico } from '../../../panel-control/modelos/medico';

@Component({
  selector: 'app-perfil-medico',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule,
    MatCardModule, MatIconModule, MatDividerModule
  ],
  templateUrl: './perfil-medico.html',
  styleUrls: ['./perfil-medico.css']
})
export class PerfilMedicoComponent {
  constructor(
    public dialogRef: MatDialogRef<PerfilMedicoComponent>,
    @Inject(MAT_DIALOG_DATA) public medico: Medico,
    private router: Router
  ) {}

  agendarCita(): void {
    this.dialogRef.close();
    // Navegamos a la página de agendar cita, podríamos pasar el ID del médico en el futuro
    this.router.navigate(['/portal/agendar-cita']);
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}