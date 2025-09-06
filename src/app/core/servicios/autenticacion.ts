import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  usuarioLogueado = signal<boolean>(this.estaLogueado());

  constructor(private router: Router) { }

  login(usuario: string, contrasena: string): boolean {
    if (usuario === 'admin' && contrasena === '1234') {
      localStorage.setItem('usuarioLogueado', 'true');
      this.usuarioLogueado.set(true);
      return true;
    }
    return false;
  }

  estaLogueado(): boolean {
    return localStorage.getItem('usuarioLogueado') === 'true';
  }

  logout() {
    localStorage.removeItem('usuarioLogueado');
    this.usuarioLogueado.set(false);
    this.router.navigate(['/login']);
  }
}