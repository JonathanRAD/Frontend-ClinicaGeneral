import { Routes } from '@angular/router';
// --- CORRECCIÓN: Se importa LayoutComponent en lugar de Layout ---
import { LayoutComponent } from './componentes/layout/layout';
import { Inicio } from './paginas/inicio/inicio';
import { GestionPacientes } from './paginas/gestion-pacientes/gestion-pacientes';
import { CalendarioCitas } from './paginas/calendario-citas/calendario-citas';
import { GestionFacturacion } from './paginas/gestion-facturacion/gestion-facturacion';
import { GestionMedicos } from './paginas/gestion-medicos/gestion-medicos';
import { GestionConfiguracion } from './paginas/gestion-configuracion/gestion-configuracion';
import { HistoriaClinicaComponent } from './paginas/historia-clinica/historia-clinica';
import { GestionReportesComponent } from './componentes/gestion-reportes/gestion-reportes';
import { MiPerfilComponent } from './paginas/mi-perfil/mi-perfil';
import { GestionUsuariosComponent } from './paginas/gestion-usuarios/gestion-usuarios';

export default [
  {
    path: '',
    // --- CORRECCIÓN: Se usa el nombre correcto del componente ---
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