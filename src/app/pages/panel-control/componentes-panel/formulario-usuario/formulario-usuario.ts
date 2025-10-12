import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Rol } from '../../../../core/models/rol';
// --- CORRECCIÓN: Importamos la interfaz desde el nuevo archivo de modelo ---
import { UserProfile } from '../../../../core/models/usuario';

@Component({
  selector: 'app-formulario-usuario',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule
  ],
  templateUrl: './formulario-usuario.html'

})
export class FormularioUsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  esModoEdicion: boolean;
  rolesDisponibles: string[] = Object.values(Rol).filter(rol => rol !== Rol.PACIENTE);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormularioUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { esModoEdicion: boolean, usuario?: UserProfile }
  ) {
    this.esModoEdicion = this.data.esModoEdicion;
    this.usuarioForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required],
      password: ['']
    });

    if (this.esModoEdicion) {
      this.usuarioForm.get('email')?.disable();
    } else {
      this.usuarioForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    }
  }

  ngOnInit(): void {
    if (this.esModoEdicion && this.data.usuario) {
      this.usuarioForm.patchValue(this.data.usuario);
    }
  }

  guardar(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.usuarioForm.getRawValue());
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}