
import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AutenticacionService } from '../../../services/autenticacion';

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
  @Input() esPortal: boolean = false;
  isMenuOpen = signal(false);
  nombreUsuario: string = '';

  constructor(
    private authService: AutenticacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.esPortal) {
      const user = this.authService.getCurrentUser();
      const email = user?.sub || 'paciente'; // El email está en el campo 'sub' del token
      this.nombreUsuario = this.capitalize(email.split('@')[0]);
    }
  }
  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }
  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}