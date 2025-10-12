// src/app/autenticacion/paginas/recuperar-contrasena/recuperar-contrasena.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recuperar-contrasena.html',
  styleUrls: ['./recuperar-contrasena.css']
})
export class RecuperarContrasena {
  email: string = '';
  correoEnviado: string = '';
  solicitudEnviada = false;

  constructor() {}

  enviarSolicitud() {
    if (this.email) {
      // En un proyecto real, aquí llamaríamos a un servicio de autenticación.
      // Por ahora, solo simulamos el flujo.
      this.correoEnviado = this.email;
      this.solicitudEnviada = true;
      console.log(`Solicitud de recuperación para: ${this.email}`);
    }
  }
}