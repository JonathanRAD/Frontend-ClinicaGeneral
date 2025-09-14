// RUTA: src/app/panel-control/panel-control.routes.ts
import { Routes } from '@angular/router';
import { Layout } from './componentes/layout/layout';
import { Inicio } from './paginas/inicio/inicio';
import { GestionPacientes } from './paginas/gestion-pacientes/gestion-pacientes';
import { CalendarioCitas } from './paginas/calendario-citas/calendario-citas';
import { GestionFacturacion } from './paginas/gestion-facturacion/gestion-facturacion';
import { GestionMedicos } from './paginas/gestion-medicos/gestion-medicos'; // <-- AÑADE ESTA LÍNEA

export default [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'inicio', component: Inicio },
      { path: 'pacientes', component: GestionPacientes },
      { path: 'citas', component: CalendarioCitas },
      { path: 'facturacion', component: GestionFacturacion },
      { path: 'medicos', component: GestionMedicos }, // <-- AÑADE ESTA LÍNEA
      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ]
  }
] as Routes;