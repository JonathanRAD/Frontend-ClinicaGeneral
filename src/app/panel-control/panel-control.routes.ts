// src/app/panel-control/panel-control.routes.ts
import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';
import { Layout } from './componentes/layout/layout'; 
import { FormularioPaciente } from './componentes/formulario-paciente/formulario-paciente';
import { GestionPacientes } from './paginas/gestion-pacientes/gestion-pacientes';
import { CalendarioCitas } from './componentes/calendario-citas/calendario-citas';
import { FormularioCita } from './componentes/formulario-cita/formulario-cita';

// CAMBIO AQUÍ: Usa 'export default' en lugar de 'export const'
export default [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'inicio', component: Inicio },
      // La ruta principal de pacientes ahora es la lista
      { path: 'pacientes', component: GestionPacientes },
      { path: 'citas', component: CalendarioCitas },
      { path: 'citas/nueva', component: FormularioCita },
      // La ruta para el formulario ahora es una sub-ruta
      { path: 'pacientes/nuevo', component: FormularioPaciente },
      { path: 'pacientes/editar/:id', component: FormularioPaciente },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ]
  }
] as Routes;