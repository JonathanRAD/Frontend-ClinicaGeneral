// RUTA: src/app/portal/componentes/layout-portal/layout-portal.ts

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AutenticacionService } from '../../../core/servicios/autenticacion';

// --- CORRECCIÓN: Se importa MatDividerModule ---
import { MatDividerModule } from '@angular/material/divider';
import { Footer } from '../../../core/componentes/footer/footer';

@Component({
  selector: 'app-layout-portal',
  standalone: true,
  // --- CORRECCIÓN: Se añade MatDividerModule a los imports ---
  imports: [RouterModule, MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule, Footer],
  templateUrl: './layout-portal.html',
  styleUrls: ['./layout-portal.css']
})
export class LayoutPortalComponent {
  nombreUsuario: string = '';

  constructor(private authService: AutenticacionService, private router: Router) {}

  ngOnInit() {
    // Obtenemos solo el nombre de usuario del email para mostrarlo
    const email = this.authService.getNombreUsuario() || 'paciente';
    this.nombreUsuario = email.split('@')[0];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}