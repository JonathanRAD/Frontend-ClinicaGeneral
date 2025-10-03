import { Component, OnInit, signal, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CitaService } from '../../../../panel-control/servicios/cita';
import { MedicoService } from '../../../../panel-control/servicios/medico';
import { Medico } from '../../../../panel-control/modelos/medico';
import { Notificacion } from '../../../../core/servicios/notificacion';

// --- IMPORTS DE ANGULAR MATERIAL ---
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule,
    MatSelectModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule,
    MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './agendar-cita.html',
  styleUrls: ['./agendar-cita.css']
})
export class AgendarCita implements OnInit {
  // --- VOLVEMOS A UN SOLO FORMULARIO ---
  formularioCita: FormGroup;

  medicos = signal<Medico[]>([]);
  cargando = signal(false);
  cargandoMedicos = signal(true);
  error = signal<string | null>(null);
  minDate: Date;
  horasDisponibles: string[] = [];

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    private medicoService: MedicoService,
    private router: Router,
    private notificacionService: Notificacion
  ) {
    this.minDate = new Date();
    this.generarHoras();

    // --- INICIALIZACIÓN DEL FORMULARIO ÚNICO ---
    this.formularioCita = this.fb.group({
      medicoId: ['', Validators.required],
      fecha: [new Date(), Validators.required],
      hora: ['', Validators.required],
      motivo: ['', [Validators.required, Validators.maxLength(300)]]
    });
  }

  ngOnInit(): void {
    this.medicoService.getMedicos().subscribe({
      next: (data: Medico[]) => {
        this.medicos.set(data);
        this.cargandoMedicos.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los médicos disponibles.');
        this.cargandoMedicos.set(false);
      }
    });
  }

  private generarHoras(): void {
    for (let h = 8; h < 18; h++) {
      this.horasDisponibles.push(`${h.toString().padStart(2, '0')}:00`);
      this.horasDisponibles.push(`${h.toString().padStart(2, '0')}:30`);
    }
  }

  agendarCita(): void {
    if (this.formularioCita.invalid) {
      this.formularioCita.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    const formValue = this.formularioCita.value;
    const fechaSeleccionada: Date = formValue.fecha;
    const [hora, minutos] = formValue.hora.split(':');
    fechaSeleccionada.setHours(parseInt(hora, 10), parseInt(minutos, 10), 0, 0);

    const datosCita = {
      medicoId: formValue.medicoId,
      fechaHora: fechaSeleccionada.toISOString(),
      motivo: formValue.motivo
    };

    this.citaService.agendarCita(datosCita).subscribe({
      next: () => {
        this.notificacionService.mostrar('Cita agendada con éxito');
        this.router.navigate(['/portal/mis-citas']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Ocurrió un error al agendar la cita.');
        this.cargando.set(false);
      }
    });
  }
}

