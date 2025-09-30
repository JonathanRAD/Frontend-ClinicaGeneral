import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CitaService } from '../../../../panel-control/servicios/cita';
import { MedicoService } from '../../../../panel-control/servicios/medico';
import { Medico } from '../../../../panel-control/modelos/medico';
import { Spinner } from '../../../../compartido/spinner/spinner';
// --- RUTA DE IMPORTACIÓN CORREGIDA ---
import { Notificacion } from '../../../../core/servicios/notificacion';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Spinner, RouterModule],
  templateUrl: './agendar-cita.html'
})
export class AgendarCita implements OnInit {
  formularioCita: FormGroup;
  medicos = signal<Medico[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    private medicoService: MedicoService,
    private router: Router,
    // --- NOMBRE DE CLASE CORREGIDO ---
    private notificacionService: Notificacion
  ) {
    this.formularioCita = this.fb.group({
      medicoId: ['', Validators.required],
      fechaHora: ['', Validators.required],
      motivo: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos(): void {
    // --- LLAMADA AL MÉTODO CORRECTO ---
    this.medicoService.getMedicos().subscribe({
      // --- AÑADIMOS EL TIPO CORRECTO ---
      next: (data: Medico[]) => this.medicos.set(data),
      error: () => this.error.set('No se pudieron cargar los médicos.')
    });
  }

  agendarCita(): void {
    if (this.formularioCita.invalid) {
      this.formularioCita.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    const datosCita = {
      ...this.formularioCita.value,
      fechaHora: new Date(this.formularioCita.value.fechaHora).toISOString()
    };

    this.citaService.agendarCita(datosCita).subscribe({
      next: () => {
        this.notificacionService.mostrar('Cita agendada con éxito');
        this.router.navigate(['/portal/mis-citas']);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Ocurrió un error al agendar la cita.');
        this.cargando.set(false);
      }
    });
  }
}