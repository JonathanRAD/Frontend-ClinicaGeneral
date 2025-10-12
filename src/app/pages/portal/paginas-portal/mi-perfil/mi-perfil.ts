// RUTA: src/app/portal/componentes/paginas/mi-perfil/mi-perfil.ts

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PerfilPacienteService } from '../../../../services/perfil-paciente.service';
import { Notificacion } from '../../../../services/notificacion';
import { Spinner } from '../../../../shared/spinner/spinner';
import { Patient } from '../../../../core/models/patient';
import { AutenticacionService } from '../../../../services/autenticacion'; // <-- PASO 1: IMPORTAR EL SERVICIO

// --- IMPORTS DE ANGULAR MATERIAL ---
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Spinner,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './mi-perfil.html',
  styleUrls: ['./mi-perfil.css']
})
export class MiPerfil implements OnInit {
  formularioPerfil: FormGroup;
  cargando = signal(true);
  guardando = signal(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private perfilService: PerfilPacienteService,
    private notificacion: Notificacion,
    private dialog: MatDialog,
    private authService: AutenticacionService // <-- PASO 2: INYECTAR EL SERVICIO
  ) {
    this.formularioPerfil = this.fb.group({
      id: [null],
      nombres: [{ value: '', disabled: true }],
      apellidos: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8,12}$')]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9,15}$')]],
      fechaNacimiento: ['', Validators.required],
      direccion: [''],
      peso: [null, [Validators.min(1), Validators.max(300)]],
      altura: [null, [Validators.min(0.5), Validators.max(2.5)]],
    });
  }

  ngOnInit(): void {
    this.perfilService.getMiPerfil().subscribe({
      next: (perfil: Patient) => {
        this.formularioPerfil.patchValue({
          ...perfil,
          email: this.authService.getNombreUsuario(), 
          fechaNacimiento: perfil.fechaNacimiento
            ? new Date(perfil.fechaNacimiento).toISOString().split('T')[0]
            : ''
        });
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar tu perfil.');
        this.cargando.set(false);
      }
    });
  }

  guardarCambios(): void {
    if (this.formularioPerfil.invalid) {
      this.formularioPerfil.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set(null);

    const datosPerfil = this.formularioPerfil.getRawValue() as Patient;

    this.perfilService.actualizarMiPerfil(datosPerfil).subscribe({
      next: () => {
        this.notificacion.mostrar('Perfil actualizado con éxito');
        this.guardando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.message || 'Error al actualizar el perfil.');
        this.guardando.set(false);
      }
    });
  }

  abrirDialogoContrasena(): void {
    console.log('Abriendo diálogo para cambiar contraseña...');
    this.notificacion.mostrar('Funcionalidad de cambio de contraseña en desarrollo.', 'exito');
  }
}