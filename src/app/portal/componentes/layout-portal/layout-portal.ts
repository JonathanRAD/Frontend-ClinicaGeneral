// RUTA: src/app/portal/componentes/layout-portal/layout-portal.ts

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer } from '../../../core/componentes/footer/footer';
import { Navbar } from '../../../core/componentes/navbar/navbar'; // Asegúrate de importar Navbar

@Component({
  selector: 'app-layout-portal',
  standalone: true,
  imports: [
    RouterModule,
    Footer,
    Navbar, // Añade el navbar a los imports
  ],
  templateUrl: './layout-portal.html',
  styleUrls: ['./layout-portal.css']
})
export class LayoutPortalComponent {
  // ¡Este componente ahora está limpio y solo se encarga de la estructura!
}