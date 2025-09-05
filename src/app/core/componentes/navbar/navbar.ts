// src/app/core/componentes/navbar/navbar.ts
import { Component, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AutenticacionService } from '../../servicios/autenticacion';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  // Obtenemos la señal directamente del servicio
  usuarioLogueado: WritableSignal<boolean>;

  constructor(
    private authService: AutenticacionService,
    private router: Router
  ) {
    this.usuarioLogueado = this.authService.usuarioLogueado;
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirigimos al login
  }
}