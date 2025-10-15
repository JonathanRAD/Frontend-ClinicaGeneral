import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AutenticacionService } from '../../../../services/autenticacion';
import { UsuarioService } from '../../../../services/usuario';
import { UserProfile } from '../../../../core/models/usuario';

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
export class LayoutComponent implements OnInit { 
  usuario: WritableSignal<UserProfile | null> = signal(null);

  constructor(
    public authService: AutenticacionService,
    private usuarioService: UsuarioService
  ) {}

   /**
   * Método público que el HTML usará para preguntar si se debe mostrar un elemento.
   * @param permiso El permiso requerido para ver el elemento del menú.
   */
  puedeVer(permiso: string): boolean {
    return this.authService.tienePermiso(permiso);
  }
  ngOnInit(): void {
    this.usuarioService.getMiPerfil().subscribe(perfil => {
      this.usuario.set(perfil);
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}