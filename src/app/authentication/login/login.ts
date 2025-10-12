
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion';


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
    const recordarmeGuardado = localStorage.getItem('recordarme');
    this.recordarme = recordarmeGuardado ? JSON.parse(recordarmeGuardado) : false;
    if (this.recordarme) {
      const emailRecordado = localStorage.getItem('correoRecordado') || '';
      this.formularioLogin.get('email')?.setValue(emailRecordado);
    }
  }

  toggleMostrarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  cambiarModo(): void {
    this.modo.set(this.modo() === 'login' ? 'registro' : 'login');
    this.mensajeError.set('');
    this.formularioLogin.reset();
    this.formularioRegistro.reset();
  }

  enviarFormulario(): void {
    this.mensajeError.set('');
    this.cargando.set(true);
    const manejarRedireccion = () => {
      const rol = this.authService.rolUsuario();
      if (rol === 'PACIENTE') {
        this.router.navigate(['/portal']); 
      } else {
        this.router.navigate(['/panel']); 
      }
    };

    if (this.modo() === 'login') {
      if (this.formularioLogin.invalid) {
        this.formularioLogin.markAllAsTouched();
        this.cargando.set(false);
        return;
      }
      
      const { email, password } = this.formularioLogin.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          if (this.recordarme) {
            localStorage.setItem('correoRecordado', email);
            localStorage.setItem('recordarme', JSON.stringify(true));
          } else {
            localStorage.removeItem('correoRecordado');
            localStorage.removeItem('recordarme');
          }
          manejarRedireccion();
        },
        error: (err) => {
          this.mensajeError.set(err.error?.message || 'Ocurrió un error inesperado.');
          this.cargando.set(false);
        }
      });
    } else { 
      if (this.formularioRegistro.invalid) {
        this.formularioRegistro.markAllAsTouched();
        this.cargando.set(false);
        return;
      }

      this.authService.register(this.formularioRegistro.value).subscribe({
        next: () => manejarRedireccion(), 
        error: (err) => {
          this.mensajeError.set(err.error?.message || 'Error en el registro.');
          this.cargando.set(false);
        }
      });
    }
  }

  get loginCtls() {
    return this.formularioLogin.controls;
  }

  get registroCtls() {
    return this.formularioRegistro.controls;
  }
}
