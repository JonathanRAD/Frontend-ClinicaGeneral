// RUTA: src/app/app.ts
import { Component, signal, WritableSignal, effect } from '@angular/core'; // <-- Asegúrate de importar 'effect'
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Navbar } from './core/componentes/navbar/navbar';
import { Footer } from './core/componentes/footer/footer';
import { ThemeService } from './core/servicios/theme.service'; // <-- IMPORTA EL SERVICIO

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule, RouterOutlet, Navbar, Footer ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  mostrarLayoutPrincipal: WritableSignal<boolean> = signal(true);

  constructor(private router: Router, private themeService: ThemeService) { // <-- INYECTA EL SERVICIO
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.mostrarLayoutPrincipal.set(!['/login', '/recuperar-contrasena'].includes(event.urlAfterRedirects));
    });

    // ESTE 'effect' APLICARÁ EL TEMA AUTOMÁTICAMENTE
    effect(() => {
      if (this.themeService.isDarkMode()) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    });
  }
}