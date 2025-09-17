// src/app/publico/publico.routes.ts
import { Routes } from '@angular/router';
import { AgendarCita } from './paginas/agendar-cita/agendar-cita';
import { MisCitas } from './paginas/mis-citas/mis-citas';

export default [
  { path: 'agendar', component: AgendarCita },
  { path: 'mis-citas', component: MisCitas },
  // La ruta vacía dentro de este módulo ahora es innecesaria, pero no hace daño
  { path: '', redirectTo: 'agendar', pathMatch: 'full' }
] as Routes;