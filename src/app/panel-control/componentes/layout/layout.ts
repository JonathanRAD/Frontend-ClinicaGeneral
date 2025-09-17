// RUTA: src/app/panel-control/componentes/layout/layout.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AutenticacionService } from '../../../core/servicios/autenticacion'; // <-- 1. IMPORTA EL SERVICIO

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout {
  // 2. INYECTA EL SERVICIO EN EL CONSTRUCTOR
  constructor(private authService: AutenticacionService) {}

  // 3. AÑADE EL MÉTODO PARA CERRAR SESIÓN
  cerrarSesion(): void {
    this.authService.logout();
  }
}