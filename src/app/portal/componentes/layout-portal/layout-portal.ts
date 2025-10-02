import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AutenticacionService } from '../../../core/servicios/autenticacion';

@Component({
  selector: 'app-layout-portal',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './layout-portal.html',
  // ===== CAMBIO AQUÍ =====
  styleUrls: ['./layout-portal.css'] 
})
export class LayoutPortalComponent {
  nombreUsuario: string = '';

  constructor(private authService: AutenticacionService, private router: Router) {}

  ngOnInit() {
    this.nombreUsuario = this.authService.getNombreUsuario() || 'Paciente';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}