import { Component, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AutenticacionService } from '../../servicios/autenticacion';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class Navbar {
  // Ahora esta propiedad es una WritableSignal<boolean>
  usuarioLogueado: WritableSignal<boolean>;

  constructor(
    public authService: AutenticacionService,
  ) {
    // Obtenemos la señal directamente del servicio
    this.usuarioLogueado = this.authService.usuarioLogueado;
  }

  cerrarSesion() {
    this.authService.logout();
    // El servicio ya se encarga de redirigir, no es necesario aquí
  }
}