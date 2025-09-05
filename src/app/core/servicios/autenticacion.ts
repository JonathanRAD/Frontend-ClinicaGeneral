// src/app/core/servicios/autenticacion.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  // Creamos una señal para el estado de autenticación
  // Se inicializa con el valor actual (si ya hay algo en localStorage)
  usuarioLogueado = signal<boolean>(this.estaLogueado());

  constructor() { }

  login(usuario: string, contrasena: string): boolean {
    if (usuario === 'admin' && contrasena === '1234') {
      localStorage.setItem('usuarioLogueado', 'true');
      this.usuarioLogueado.set(true); // Actualizamos la señal
      return true;
    }
    return false;
  }

  estaLogueado(): boolean {
    return localStorage.getItem('usuarioLogueado') === 'true';
  }

  logout() {
    localStorage.removeItem('usuarioLogueado');
    this.usuarioLogueado.set(false); // Actualizamos la señal
  }
}