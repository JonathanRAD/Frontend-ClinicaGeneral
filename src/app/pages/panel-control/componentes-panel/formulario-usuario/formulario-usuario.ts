import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox'; // <- Importante
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // <- Para feedback visual

// --- Nuestros nuevos modelos y servicios ---
import { UserProfile } from '../../../../core/models/usuario';
import { Role } from '../../../../core/models/rol';
import { RolService } from '../../../../services/rol.service';

@Component({
  selector: 'app-formulario-usuario',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCheckboxModule, MatProgressSpinnerModule
  ],
  templateUrl: './formulario-usuario.html',
})
export class FormularioUsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  esModoEdicion: boolean;
  rolesDisponibles$!: Observable<Role[]>; 

  constructor(
    private fb: FormBuilder,
    private rolService: RolService, 
    public dialogRef: MatDialogRef<FormularioUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario?: UserProfile }
  ) {
    this.esModoEdicion = !!this.data.usuario;

    this.usuarioForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      roleIds: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });

    if (!this.esModoEdicion) {
      this.usuarioForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    }
  }

  ngOnInit(): void {
    this.rolesDisponibles$ = this.rolService.obtenerTodosLosRoles();

    if (this.esModoEdicion && this.data.usuario) {
      this.usuarioForm.patchValue({
        nombres: this.data.usuario.nombres,
        apellidos: this.data.usuario.apellidos,
        email: this.data.usuario.email
      });

      this.data.usuario.roles.forEach(role => {
        this.roleIdsArray.push(new FormControl(role.id));
      });
    }
  }

  get roleIdsArray(): FormArray {
    return this.usuarioForm.get('roleIds') as FormArray;
  }

  onCheckboxChange(event: any): void {
    const roleId = Number(event.source.value);
    if (event.checked) {
      this.roleIdsArray.push(new FormControl(roleId));
    } else {
      const index = this.roleIdsArray.controls.findIndex(x => x.value === roleId);
      this.roleIdsArray.removeAt(index);
    }
  }

  isChecked(roleId: number): boolean {
    return this.roleIdsArray.value.includes(roleId);
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