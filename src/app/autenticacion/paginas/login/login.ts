// src/app/autenticacion/paginas/login/login.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // <-- 1. Importa RouterModule
import { AutenticacionService } from '../../../core/servicios/autenticacion';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule // <-- 2. Añádelo a los imports del componente
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  // ... (el resto de tu código no necesita cambios)
  usuario: string = '';
  contrasena: string = '';
  recordarme: boolean = false;
  errorMensaje: string = '';

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

  iniciarSesion() {
    this.errorMensaje = '';

    const exito = this.authService.login(this.usuario, this.contrasena);

    if (exito) {
      if (this.recordarme) {
        localStorage.setItem('correoRecordado', this.usuario);
        localStorage.setItem('recordarme', JSON.stringify(true));
      } else {
        localStorage.removeItem('correoRecordado');
        localStorage.removeItem('recordarme');
      }
      this.router.navigate(['/panel']);
    } else {
      this.errorMensaje = 'Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.';
    }
  }
}