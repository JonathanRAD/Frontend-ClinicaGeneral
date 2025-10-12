import { Routes } from '@angular/router';
import { LayoutComponent } from './componentes-panel/layout/layout';
import { Inicio } from './paginas-panel/inicio/inicio';
import { GestionPacientes } from './paginas-panel/gestion-pacientes/gestion-pacientes';
import { CalendarioCitas } from './paginas-panel/calendario-citas/calendario-citas';
import { GestionFacturacion } from './paginas-panel/gestion-facturacion/gestion-facturacion';
import { GestionMedicos } from './paginas-panel/gestion-medicos/gestion-medicos';
import { GestionConfiguracion } from './paginas-panel/gestion-configuracion/gestion-configuracion';
import { HistoriaClinicaComponent } from './paginas-panel/historia-clinica/historia-clinica';
import { GestionReportesComponent } from './componentes-panel/gestion-reportes/gestion-reportes';
import { MiPerfilComponent } from './paginas-panel/mi-perfil/mi-perfil';
import { GestionUsuariosComponent } from './paginas-panel/gestion-usuarios/gestion-usuarios';

export default [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'inicio', component: Inicio },
      { path: 'pacientes', component: GestionPacientes },
      { path: 'pacientes/:id/historia', component: HistoriaClinicaComponent },
      { path: 'citas', component: CalendarioCitas },
      { path: 'facturacion', component: GestionFacturacion },
      { path: 'medicos', component: GestionMedicos },
      { path: 'usuarios', component: GestionUsuariosComponent },
      { path: 'reportes', component: GestionReportesComponent },
      { path: 'configuracion', component: GestionConfiguracion },
      { path: 'mi-perfil', component: MiPerfilComponent },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ]
  }
] as Routes;