import { Component, OnInit, signal } from '@angular/core'; // 1. Importa 'signal'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AutenticacionService } from '../../../core/servicios/autenticacion';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterModule ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  // --- Propiedades del formulario (se mantienen igual) ---
  usuario: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  recordarme: boolean = false;

  // --- Control de la UI (ahora con signals) ---
  modo = signal<'login' | 'registro'>('login');
  errorMensaje = signal<string>('');
  cargando = signal<boolean>(false);

  constructor(
    private authService: AutenticacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const recordarmeGuardado = localStorage.getItem('recordarme');
    this.recordarme = recordarmeGuardado ? JSON.parse(recordarmeGuardado) : false;
    if (this.recordarme) {
      this.usuario = localStorage.getItem('correoRecordado') || '';
    }
  }

  cambiarModo(nuevoModo: 'login' | 'registro'): void {
    this.modo.set(nuevoModo);
    this.errorMensaje.set('');
    this.contrasena = '';
    this.confirmarContrasena = '';
  }

  iniciarSesion(): void {
    if (!this.usuario || !this.contrasena) return;
    
    // 2. Usamos .set() para actualizar los signals
    this.cargando.set(true);
    this.errorMensaje.set('');

    this.authService.login(this.usuario, this.contrasena).subscribe({
      next: () => {
        if (this.recordarme) {
          localStorage.setItem('correoRecordado', this.usuario);
          localStorage.setItem('recordarme', JSON.stringify(true));
        } else {
          localStorage.removeItem('correoRecordado');
          localStorage.removeItem('recordarme');
        }
        this.router.navigate(['/panel']);
        // No es necesario poner cargando a false aquí por la navegación
      },
      error: (err) => {
        this.errorMensaje.set('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        this.cargando.set(false); // La UI se actualizará instantáneamente
      }
    });
  }

  registrarUsuario(): void {
    if (!this.usuario || !this.contrasena) return;
    if (this.contrasena !== this.confirmarContrasena) {
      this.errorMensaje.set('Las contraseñas no coinciden.');
      return;
    }
    
    this.cargando.set(true);
    this.errorMensaje.set('');

    this.authService.register(this.usuario, this.contrasena).subscribe({
        next: () => {
          this.router.navigate(['/panel']);
        },
        error: (err) => {
          this.errorMensaje.set('No se pudo registrar. El correo ya podría estar en uso.');
          this.cargando.set(false); // La UI se actualizará instantáneamente
        }
    });
  }
}
