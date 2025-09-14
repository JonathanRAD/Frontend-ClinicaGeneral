// RUTA: src/app/panel-control/componentes/formulario-medico/formulario-medico.ts

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-formulario-medico',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule
  ],
  templateUrl: './formulario-medico.html'
})
export class FormularioMedico implements OnInit {
  medicoForm: FormGroup;
  esModoEdicion: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormularioMedico>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.esModoEdicion = this.data.esModoEdicion;
    this.medicoForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      especialidad: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.esModoEdicion && this.data.medico) {
      this.medicoForm.patchValue(this.data.medico);
    }
  }

  guardar(): void {
    if (this.medicoForm.invalid) {
      this.medicoForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.medicoForm.value);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}