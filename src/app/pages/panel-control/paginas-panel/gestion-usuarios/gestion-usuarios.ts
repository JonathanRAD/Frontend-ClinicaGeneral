import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize } from 'rxjs/operators';

import { UsuarioService } from '../../../../services/usuario';
import { UserProfile } from '../../../../core/models/usuario';
import { FormularioUsuarioComponent } from '../../componentes-panel/formulario-usuario/formulario-usuario';
// --- CORRECCIÓN: El nombre de la clase es 'DialogoConfirmacion' ---
import { DialogoConfirmacion } from '../../componentes-panel/dialogo-confirmacion/dialogo-confirmacion';
// --- CORRECCIÓN: Importar el servicio que creamos ---
import { NotificacionService } from '../../../../services/notificacion';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatDialogModule, MatButtonModule, MatIconModule, MatTooltipModule
  ],
  templateUrl: './gestion-usuarios.html',
  styleUrls: ['./gestion-usuarios.css']
})
export class GestionUsuariosComponent implements OnInit {
  usuarios = signal<UserProfile[]>([]);
  isLoading = signal<boolean>(true);
  displayedColumns: string[] = ['nombres', 'email', 'roles', 'fechaRegistro', 'acciones'];

  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService // Ahora la inyección es correcta
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.isLoading.set(true);
    this.usuarioService.obtenerTodosLosUsuarios()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => this.usuarios.set(data),
        error: (err) => this.notificacionService.mostrar('Error al cargar usuarios', 'error')
      });
  }

  abrirModal(usuario?: UserProfile): void {
    const dialogRef = this.dialog.open(FormularioUsuarioComponent, {
      width: '500px',
      data: { usuario }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (!resultado) return;
      if (usuario?.id) {
        this.actualizarUsuario(usuario.id, resultado);
      } else {
        this.crearUsuario(resultado);
      }
    });
  }

  crearUsuario(datos: any): void {
    this.usuarioService.crearUsuario(datos).subscribe({
      next: () => {
        this.notificacionService.mostrar('Usuario creado con éxito', 'success');
        this.cargarUsuarios();
      },
      error: (err) => this.notificacionService.mostrar(err.error?.message || 'Error al crear usuario', 'error')
    });
  }

  actualizarUsuario(id: number, datos: any): void {
    this.usuarioService.actualizarUsuario(id, datos).subscribe({
      next: () => {
        this.notificacionService.mostrar('Usuario actualizado con éxito', 'success');
        this.cargarUsuarios();
      },
      error: (err) => this.notificacionService.mostrar(err.error?.message || 'Error al actualizar', 'error')
    });
  }

  eliminarUsuario(id: number): void {
    // --- CORRECCIÓN: Usar el nombre de clase correcto 'DialogoConfirmacion' ---
    const dialogRef = this.dialog.open(DialogoConfirmacion, {
      width: '350px',
      data: { titulo: 'Confirmar Eliminación', mensaje: '¿Estás seguro de que deseas eliminar este usuario?' }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.usuarioService.eliminarUsuario(id).subscribe({
          next: () => {
            this.notificacionService.mostrar('Usuario eliminado con éxito', 'success');
            this.cargarUsuarios();
          },
          error: (err) => this.notificacionService.mostrar(err.error.message || 'Error al eliminar', 'error')
        });
      }
    });
  }

  formatRoles(roles: any[]): string {
    if (!roles || roles.length === 0) return 'Sin rol';
    return roles.map(r => r.name).join(', ');
  }
}