import { Routes } from '@angular/router';
import { Layout } from './componentes/layout/layout';
import { Inicio } from './paginas/inicio/inicio';
import { GestionPacientes } from './paginas/gestion-pacientes/gestion-pacientes';
import { CalendarioCitas } from './componentes/calendario-citas/calendario-citas';
// Ya no necesitamos importar el FormularioPaciente aquí

export default [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'inicio', component: Inicio },
      { path: 'pacientes', component: GestionPacientes },
      { path: 'citas', component: CalendarioCitas },
      // Hemos eliminado las rutas 'pacientes/nuevo' y 'pacientes/editar/:id'
      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ]
  }
] as Routes;