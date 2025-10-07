// RUTA: src/app/core/componentes/navbar/navbar.ts

import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AutenticacionService } from '../../servicios/autenticacion';

// Importaciones de Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  // Con @Input(), le decimos si es el navbar del portal o el público.
  @Input() esPortal: boolean = false;

  // Signal para controlar el estado del menú móvil (abierto/cerrado).
  isMenuOpen = signal(false);
  nombreUsuario: string = '';

  constructor(
    private authService: AutenticacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si es el navbar del portal, obtenemos el nombre de usuario.
    if (this.esPortal) {
      const email = this.authService.getNombreUsuario() || 'paciente';
      this.nombreUsuario = this.capitalize(email.split('@')[0]);
    }
  }

  // Cambia el estado del menú móvil.
  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  // Cierra el menú móvil (útil al hacer clic en un enlace).
  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  // Pequeña utilidad para poner en mayúscula la primera letra.
  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}