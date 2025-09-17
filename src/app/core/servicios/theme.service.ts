// RUTA: frontend-clinica/src/app/core/servicios/theme.service.ts
import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Usamos una señal para el estado del modo oscuro
  isDarkMode: WritableSignal<boolean> = signal(false);

  constructor() {
    // Al iniciar, revisa si hay un tema guardado en el navegador
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    }
  }

  // Método para cambiar el tema
  toggleTheme() {
    this.isDarkMode.update(value => !value);
    // Guarda la preferencia en el navegador
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
  }
}