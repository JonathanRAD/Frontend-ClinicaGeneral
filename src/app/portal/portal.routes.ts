import { Routes } from '@angular/router';
import { LayoutPortal } from './componentes/layout-portal/layout-portal';

export default [
  {
    path: '',
    component: LayoutPortal,
    children: [
      {
        path: 'mis-citas',
        loadComponent: () => import('./componentes/paginas/mis-citas/mis-citas').then(c => c.MisCitas)
      },
      // --- AÑADE ESTA NUEVA RUTA ---
      {
        path: 'agendar-cita',
        loadComponent: () => import('./componentes/paginas/agendar-cita/agendar-cita').then(c => c.AgendarCita)
      },
      {
    path: 'mi-perfil',
    loadComponent: () => import('./componentes/paginas/mi-perfil/mi-perfil').then(c => c.MiPerfil)
      },
      {
    path: 'mi-historial',
    loadComponent: () => import('./componentes/paginas/mi-historial/mi-historial').then(c => c.MiHistorial)
      },
      {
        path: '',
        redirectTo: 'mis-citas',
        pathMatch: 'full'
      }
    ]
  }
] as Routes;