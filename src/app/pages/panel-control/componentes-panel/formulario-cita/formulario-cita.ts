// RUTA: src/app/panel-control/componentes/formulario-cita/formulario-cita.ts

import { Component, OnInit, Inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker'; // <-- Para el calendario
import { MatNativeDateModule } from '@angular/material/core'; // <-- Necesario para el datepicker

import { PacienteService } from '../../../../services/paciente';
import { MedicoService } from '../../../../services/medico';
import { Patient } from '../../../../core/models/patient';
import { Medico } from '../../../../core/models/medico';

@Component({
  selector: 'app-formulario-cita',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule,
    MatNativeDateModule // <-- Asegúrate de que este import esté
  ],
  templateUrl: './formulario-cita.html',
  styleUrls: ['./formulario-cita.css']
})
export class FormularioCita implements OnInit {
  citaForm: FormGroup;
  esModoEdicion: boolean;
  pacientes: Signal<Patient[]>;
  medicos: Signal<Medico[]>;
  horasDisponibles: string[] = []; // Array para las horas

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormularioCita>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pacienteService: PacienteService,
    private medicoService: MedicoService
  ) {
    this.esModoEdicion = this.data.esModoEdicion;
    this.pacientes = this.pacienteService.pacientes;
    this.medicos = this.medicoService.medicos;
    
    // 1. Generamos las horas disponibles
    this.generarHoras();

    // 2. Creamos el formulario con controles separados para fecha y hora
    this.citaForm = this.fb.group({
      pacienteId: ['', Validators.required],
      medicoId: ['', Validators.required],
      fecha: [new Date(), Validators.required], // <-- Por defecto, la fecha actual
      hora: ['', Validators.required],
      motivo: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    if (this.esModoEdicion && this.data.cita) {
      const fechaCita = new Date(this.data.cita.fechaHora);
      this.citaForm.patchValue({
        pacienteId: this.data.cita.paciente.id,
        medicoId: this.data.cita.medico.id,
        fecha: fechaCita,
        // Formateamos la hora para que coincida con el formato del select (ej: "09:30")
        hora: fechaCita.toTimeString().slice(0, 5),
        motivo: this.data.cita.motivo
      });
    }
  }

  // 3. Método para generar las horas en intervalos de 30 mins
  private generarHoras() {
    for (let h = 8; h < 18; h++) { // Horario de 8am a 5pm
      this.horasDisponibles.push(`${h.toString().padStart(2, '0')}:00`);
      this.horasDisponibles.push(`${h.toString().padStart(2, '0')}:30`);
    }
  }

  guardar(): void {
    if (this.citaForm.invalid) {
      this.citaForm.markAllAsTouched();
      return;
    }

    // 4. Combinamos la fecha y la hora antes de enviar
    const formValue = this.citaForm.value;
    const fechaSeleccionada: Date = formValue.fecha;
    const [hora, minutos] = formValue.hora.split(':');
    
    fechaSeleccionada.setHours(parseInt(hora), parseInt(minutos), 0, 0);

    // Creamos el objeto final que espera el servicio
    const payload = {
      pacienteId: formValue.pacienteId,
      medicoId: formValue.medicoId,
      fechaHora: fechaSeleccionada.toISOString(), // Enviamos en formato ISO
      motivo: formValue.motivo
    };

    this.dialogRef.close(payload);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}