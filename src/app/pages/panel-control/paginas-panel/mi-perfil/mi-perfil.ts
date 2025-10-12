import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../../../../services/usuario';
import { UserProfile } from '../../../../core/models/usuario';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './mi-perfil.html',
  styleUrls: ['./mi-perfil.css']
})
export class MiPerfilComponent implements OnInit {
  perfilForm: FormGroup;
  contrasenaForm: FormGroup;
  modoEdicion = false;

  usuario: WritableSignal<UserProfile | null> = signal(null);
  permisos: WritableSignal<string[]> = signal([]);

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {
    this.perfilForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: [{ value: '', disabled: true }]
    });

    this.contrasenaForm = this.fb.group({
      contrasenaActual: ['', Validators.required],
      nuevaContrasena: ['', [Validators.required, Validators.minLength(8)]],
      confirmarContrasena: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  ngOnInit(): void {
    this.usuarioService.getMiPerfil().subscribe(user => {
      this.usuario.set(user);
      this.perfilForm.patchValue(user);
      this.permisos.set(this.mapearRolAPermisos(user.rol));
    });
  }

  private mapearRolAPermisos(rol: string): string[] {
    const permisosPorRol: { [key: string]: string[] } = {
      'ADMINISTRADOR': ['Acceso total al sistema', 'Gestionar usuarios y roles', 'Ver reportes financieros', 'Configuración avanzada'],
      'MEDICO': ['Acceder a historias clínicas', 'Registrar consultas y diagnósticos', 'Generar órdenes de laboratorio'],
      'RECEPCIONISTA': ['Gestionar agenda de citas', 'Registrar y buscar pacientes', 'Ver disponibilidad de médicos']
    };
    return permisosPorRol[rol] || ['Permisos básicos de la plataforma'];
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls['nuevaContrasena'].value;
    const confirmPass = group.controls['confirmarContrasena'].value;
    return pass === confirmPass ? null : { notSame: true };
  }

  activarEdicion(): void {
    this.modoEdicion = true;
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.ngOnInit();
  }

  guardarPerfil(): void {
    if (this.perfilForm.invalid || !this.usuario()) return;

    const datosPerfil: UserProfile = {
      ...this.usuario()!,
      ...this.perfilForm.getRawValue()
    };

    this.usuarioService.actualizarPerfil(datosPerfil).subscribe({
      next: (usuarioActualizado) => {
        this.usuario.set(usuarioActualizado);
        this.snackBar.open('Perfil actualizado con éxito', 'Cerrar', { duration: 3000 });
        this.modoEdicion = false;
      },
      error: () => this.snackBar.open('Error al actualizar el perfil', 'Cerrar', { duration: 3000 })
    });
  }

  cambiarContrasena(): void {
    if (this.contrasenaForm.invalid) return;

    this.usuarioService.cambiarContrasena({
      contrasenaActual: this.contrasenaForm.value.contrasenaActual,
      nuevaContrasena: this.contrasenaForm.value.nuevaContrasena
    }).subscribe({
      next: () => {
        this.snackBar.open('Contraseña actualizada correctamente', 'Cerrar', { duration: 3000 });
        this.contrasenaForm.reset();
      },
      error: () => this.snackBar.open('Error al cambiar la contraseña', 'Cerrar', { duration: 3000 })
    });
  }
}