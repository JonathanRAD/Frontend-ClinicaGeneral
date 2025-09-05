// src/app/app.component.ts
import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Navbar } from './core/componentes/navbar/navbar';
import { Footer } from './core/componentes/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule, RouterOutlet, Navbar, Footer ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  // Creamos una señal para controlar la visibilidad del layout
  mostrarLayoutPrincipal: WritableSignal<boolean> = signal(true);

  constructor(private router: Router) {
    // Escuchamos los cambios en la navegación
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Si la URL actual es '/login', ocultamos el layout. Si no, lo mostramos.
      this.mostrarLayoutPrincipal.set(event.urlAfterRedirects !== '/login');
    });
  }
}