import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion';
import { HttpErrorResponse } from '@angular/common/http';

// Tu validador de contraseña (sin cambios)
export function contrasenaSeguraValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    const tieneMayuscula = /[A-Z]/.test(value);
    const tieneMinuscula = /[a-z]/.test(value);
    const tieneNumero = /[0-9]/.test(value);
    const tieneCaracterEspecial = /[@$!%*?&_#.,;:<>(){}\[\]\-+=/\|~`^]/.test(value);
    const esValida = tieneMayuscula && tieneMinuscula && tieneNumero && tieneCaracterEspecial;
    return !esValida ? { contrasenaInsegura: true } : null;
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, RouterModule ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  // Tus propiedades (sin cambios)
  formularioLogin: FormGroup;
  formularioRegistro: FormGroup;
  maxNombreApellidoLength = 20;
  modo = signal<'login' | 'registro'>('login');
  mensajeError = signal<string>('');
  cargando = signal<boolean>(false);
  recordarme = false;
  mostrarContrasena = false;

  constructor(
    private fb: FormBuilder,
    private authService: AutenticacionService,
    private router: Router
  ) {
    // Tus formularios (sin cambios)
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    this.formularioRegistro = this.fb.group({
        nombres: ['', [Validators.required, Validators.maxLength(this.maxNombreApellidoLength), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        apellidos: ['', [Validators.required, Validators.maxLength(this.maxNombreApellidoLength), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [
            Validators.required,
            Validators.minLength(8),
            contrasenaSeguraValidator()
        ]]
    });
  }

  ngOnInit(): void {
    // Tu lógica de "recordarme" (sin cambios)
    const recordarmeGuardado = localStorage.getItem('recordarme');
    this.recordarme = recordarmeGuardado ? JSON.parse(recordarmeGuardado) : false;
    if (this.recordarme) {
      const emailRecordado = localStorage.getItem('correoRecordado') || '';
      this.formularioLogin.get('email')?.setValue(emailRecordado);
    }
  }

  // Tus métodos de UI (sin cambios)
  toggleMostrarContrasena(): void { this.mostrarContrasena = !this.mostrarContrasena; }
  cambiarModo(): void { /* ... */ }

  enviarFormulario(): void {
    this.mensajeError.set('');
    this.cargando.set(true);

    const manejarRedireccion = () => {
      // --- CORRECCIÓN CLAVE 1: Usar el nuevo método tieneRol() ---
      if (this.authService.tieneRol('PACIENTE')) {
        this.router.navigate(['/portal']); 
      } else {
        this.router.navigate(['/panel']); 
      }
    };

    if (this.modo() === 'login') {
      if (this.formularioLogin.invalid) { /* ... */ return; }
      
      const { email, password } = this.formularioLogin.value;
      // --- CORRECCIÓN CLAVE 2: Llamar a login con un solo objeto ---
      this.authService.login({ email, password }).subscribe({
        next: () => {
          // Tu lógica de "recordarme" (sin cambios)
          if (this.recordarme) { /* ... */ } else { /* ... */ }
          manejarRedireccion();
        },
        error: (err: HttpErrorResponse) => {
          this.mensajeError.set(err.error?.message || 'Ocurrió un error inesperado.');
          this.cargando.set(false);
        }
      });
    } else { // Modo registro
      if (this.formularioRegistro.invalid) { /* ... */ return; }

      // --- CORRECCIÓN CLAVE 3: El método register() es correcto y existe ---
      this.authService.register(this.formularioRegistro.value).subscribe({
        next: () => this.router.navigate(['/portal']), // Después de registrarse, un usuario siempre es PACIENTE
        error: (err: HttpErrorResponse) => {
          this.mensajeError.set(err.error?.message || 'Error en el registro.');
          this.cargando.set(false);
        }
      });
    }
  }

  // Tus getters (sin cambios)
  get loginCtls() { return this.formularioLogin.controls; }
  get registroCtls() { return this.formularioRegistro.controls; }
}