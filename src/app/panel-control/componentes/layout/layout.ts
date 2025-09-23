import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AutenticacionService } from '../../../core/servicios/autenticacion';
import { UsuarioService } from '../../servicios/usuario';
import { UserProfile } from '../../modelos/usuario';

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
export class LayoutComponent implements OnInit { // El nombre correcto es LayoutComponent
  usuario: WritableSignal<UserProfile | null> = signal(null);

  constructor(
    public authService: AutenticacionService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.usuarioService.getMiPerfil().subscribe(perfil => {
      this.usuario.set(perfil);
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}