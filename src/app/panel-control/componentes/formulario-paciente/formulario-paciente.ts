// src/app/panel-control/componentes/formulario-paciente/formulario-paciente.ts
import { Component, OnInit } from '@angular/core'; // 1. Importa OnInit
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router'; // 2. Importa ActivatedRoute
import { PacienteService } from '../../servicios/paciente';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-formulario-paciente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule, 
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './formulario-paciente.html',
  styleUrls: ['./formulario-paciente.css']
})
export class FormularioPaciente implements OnInit { // 3. Implementa OnInit
  pacienteForm: FormGroup;
  esModoEdicion = false;
  pacienteIdActual: string | null = null;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private router: Router,
    private route: ActivatedRoute // 4. Inyecta ActivatedRoute
  ) {
    this.pacienteForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      fechaNacimiento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // 5. Al iniciar el componente, revisamos la URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.esModoEdicion = true;
        this.pacienteIdActual = id;
        const pacienteExistente = this.pacienteService.getPacientePorId(id);
        if (pacienteExistente) {
          // Formateamos la fecha para el input type="date"
          const fechaFormateada = new Date(pacienteExistente.fechaNacimiento).toISOString().substring(0, 10);
          this.pacienteForm.patchValue({
            ...pacienteExistente,
            fechaNacimiento: fechaFormateada
          });
        }
      }
    });
  }

  guardarPaciente() {
    if (this.pacienteForm.invalid) {
      this.pacienteForm.markAllAsTouched();
      return;
    }

    if (this.esModoEdicion && this.pacienteIdActual) {
      // Lógica para ACTUALIZAR
      const pacienteActualizado = { id: this.pacienteIdActual, ...this.pacienteForm.value };
      this.pacienteService.actualizarPaciente(pacienteActualizado);
      alert('¡Paciente actualizado con éxito!');
    } else {
      // Lógica para CREAR
      this.pacienteService.registrarPaciente(this.pacienteForm.value);
      alert('¡Paciente registrado con éxito!');
    }
    this.router.navigate(['/panel/pacientes']);
  }
}