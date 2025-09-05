// src/app/panel-control/componentes/formulario-cita/formulario-cita.ts
import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CitaService } from '../../servicios/cita';
import { PacienteService } from '../../servicios/paciente';
import { MedicoService } from '../../servicios/medico';
import { Patient } from '../../modelos/patient';
import { Medico } from '../../modelos/medico';
import { Cita } from '../../modelos/cita';

@Component({
  selector: 'app-formulario-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-cita.html',
  styleUrls: ['./formulario-cita.css']
})
export class FormularioCita implements OnInit {
  citaForm: FormGroup;
  pacientes: Signal<Patient[]>;
  medicos: Signal<Medico[]>;

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private router: Router
  ) {
    this.pacientes = this.pacienteService.pacientes;
    this.medicos = this.medicoService.medicos;

    this.citaForm = this.fb.group({
      pacienteId: ['', Validators.required],
      medicoId: ['', Validators.required],
      fechaHora: ['', Validators.required],
      motivo: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  agendarCita() {
    if (this.citaForm.invalid) {
      this.citaForm.markAllAsTouched();
      return;
    }

    const formValue = this.citaForm.value;
    const pacienteSeleccionado = this.pacientes().find(p => p.id === formValue.pacienteId);
    const medicoSeleccionado = this.medicos().find(m => m.id === formValue.medicoId);

    if (!pacienteSeleccionado || !medicoSeleccionado) {
      alert('Error: Paciente o médico no encontrado.');
      return;
    }

    const nuevaCita: Omit<Cita, 'id'> = {
      fechaHora: new Date(formValue.fechaHora),
      paciente: pacienteSeleccionado,
      medico: medicoSeleccionado,
      motivo: formValue.motivo,
      estado: 'programada'
    };

    this.citaService.agendarCita(nuevaCita);
    alert('¡Cita agendada con éxito!');
    this.router.navigate(['/panel/citas']);
  }
}