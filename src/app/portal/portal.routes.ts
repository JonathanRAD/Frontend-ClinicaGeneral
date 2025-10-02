import { Routes } from '@angular/router';
import { LayoutPortalComponent } from './componentes/layout-portal/layout-portal';

// =========== INICIO DE LA CORRECCIÓN ===========
// Se han corregido los nombres de los componentes para que coincidan con tus archivos.
// Por ejemplo, "MisCitas" en lugar de "MisCitasComponent".
import { MisCitas } from './componentes/paginas/mis-citas/mis-citas';
import { AgendarCita } from './componentes/paginas/agendar-cita/agendar-cita';
import { MiHistorial } from './componentes/paginas/mi-historial/mi-historial';
import { MiPerfil } from './componentes/paginas/mi-perfil/mi-perfil';
// =========== FIN DE LA CORRECCIÓN ===========

export const PORTAL_ROUTES: Routes = [
  {
    path: '',
    component: LayoutPortalComponent,
    children: [
      // También se actualizan los nombres de los componentes aquí
      { path: 'mis-citas', component: MisCitas },
      { path: 'agendar-cita', component: AgendarCita },
      { path: 'mi-historial', component: MiHistorial },
      { path: 'mi-perfil', component: MiPerfil },
      { path: '', redirectTo: 'mis-citas', pathMatch: 'full' }
    ]
  }
];