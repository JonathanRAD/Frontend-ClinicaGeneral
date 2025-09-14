// RUTA: src/app/panel-control/componentes/formulario-cita/formulario-cita.ts

import { Component, OnInit, Inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { PacienteService } from '../../servicios/paciente';
import { MedicoService } from '../../servicios/medico';
import { Patient } from '../../modelos/patient';
import { Medico } from '../../modelos/medico';

@Component({
  selector: 'app-formulario-cita',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule
  ],
  templateUrl: './formulario-cita.html',
  styleUrls: ['./formulario-cita.css']
})
export class FormularioCita implements OnInit {
  citaForm: FormGroup;
  esModoEdicion: boolean;
  pacientes: Signal<Patient[]>;
  medicos: Signal<Medico[]>;

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

    this.citaForm = this.fb.group({
      pacienteId: ['', Validators.required],
      medicoId: ['', Validators.required],
      fechaHora: ['', Validators.required],
      motivo: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    if (this.esModoEdicion && this.data.cita) {
      const fecha = new Date(this.data.cita.fechaHora);
      // Ajusta para la zona horaria local y formatea para el input datetime-local
      const offset = fecha.getTimezoneOffset() * 60000;
      const fechaLocal = new Date(fecha.getTime() - offset);
      const fechaISO = fechaLocal.toISOString().slice(0, 16);

      this.citaForm.patchValue({
        pacienteId: this.data.cita.paciente.id,
        medicoId: this.data.cita.medico.id,
        fechaHora: fechaISO,
        motivo: this.data.cita.motivo
      });
    }
  }

  guardar(): void {
    if (this.citaForm.invalid) {
      this.citaForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.citaForm.value);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}