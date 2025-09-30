import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// --- Usando las importaciones correctas según tu estructura ---
import { PerfilPacienteService } from '../../../services/perfil-paciente.service';
import { Notificacion } from '../../../../core/servicios/notificacion';
import { Spinner } from '../../../../compartido/spinner/spinner';
import { Patient } from '../../../../panel-control/modelos/patient';
@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Spinner],
  templateUrl: './mi-perfil.html',
})
export class MiPerfil implements OnInit {
  formularioPerfil: FormGroup;
  cargando = signal(true);
  guardando = signal(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private perfilService: PerfilPacienteService,
    private notificacion: Notificacion
  ) {
    this.formularioPerfil = this.fb.group({
      id: [null],
      nombres: [{ value: '', disabled: true }],
      apellidos: [{ value: '', disabled: true }],
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
        // --- INICIO DE LA CORRECCIÓN DEFINITIVA PARA LA FECHA ---
        this.formularioPerfil.patchValue({
          ...perfil,
          // Sobreescribimos solo la fecha de nacimiento con el formato string que necesita el input
          fechaNacimiento: perfil.fechaNacimiento 
            ? new Date(perfil.fechaNacimiento).toISOString().split('T')[0] 
            : ''
        });
        // --- FIN DE LA CORRECCIÓN ---

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
}