// RUTA: src/app/app.ts
import { Component, signal, WritableSignal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Navbar } from './core/componentes/navbar/navbar';
import { Footer } from './core/componentes/footer/footer';
import { ThemeService } from './core/servicios/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule, RouterOutlet, Navbar, Footer ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  // CAMBIO: Señales separadas para un mejor control
  mostrarNavbar: WritableSignal<boolean> = signal(true);
  mostrarFooter: WritableSignal<boolean> = signal(true);

  constructor(private router: Router, private themeService: ThemeService) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      const esPaginaAutenticacion = ['/login', '/recuperar-contrasena'].includes(url);
      const esPanelDeControl = url.startsWith('/panel');

      // El navbar se muestra en todas partes menos en las de autenticación
      this.mostrarNavbar.set(!esPaginaAutenticacion && !esPanelDeControl);
      // El footer solo se muestra en las páginas que NO son de autenticación Y NO son del panel
      this.mostrarFooter.set(!esPaginaAutenticacion && !esPanelDeControl);
    });

    effect(() => {
      if (this.themeService.isDarkMode()) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    });
  }
}