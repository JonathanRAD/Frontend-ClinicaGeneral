// RUTA: src/app/panel-control/panel-control.routes.ts
import { Routes } from '@angular/router';
import { Layout } from './componentes/layout/layout';
import { Inicio } from './paginas/inicio/inicio';
import { GestionPacientes } from './paginas/gestion-pacientes/gestion-pacientes';
import { CalendarioCitas } from './paginas/calendario-citas/calendario-citas';
import { GestionFacturacion } from './paginas/gestion-facturacion/gestion-facturacion';
import { GestionMedicos } from './paginas/gestion-medicos/gestion-medicos';
import { GestionConfiguracion } from './paginas/gestion-configuracion/gestion-configuracion'; // <-- AÑADE ESTA LÍNEA
import { HistoriaClinicaComponent } from './paginas/historia-clinica/historia-clinica'; 

export default [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'inicio', component: Inicio },
      { path: 'pacientes', component: GestionPacientes },
      { path: 'pacientes/:id/historia', component: HistoriaClinicaComponent },
      { path: 'citas', component: CalendarioCitas },
      { path: 'facturacion', component: GestionFacturacion },
      { path: 'medicos', component: GestionMedicos },
      { path: 'configuracion', component: GestionConfiguracion }, // <-- AÑADE ESTA LÍNEA
      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ]
  }
] as Routes;