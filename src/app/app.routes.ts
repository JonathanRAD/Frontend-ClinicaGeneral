import { Routes } from '@angular/router';
import { autenticacionGuard } from './core/guards/autenticacion-guard';
// Importamos el nuevo guard de permisos
import { permissionGuard } from './core/guards/permission-guard';

// Guards antiguos que ya no usaremos
// import { rolGuard } from './core/guards/rol-guard';
// import { pacienteGuard } from './core/guards/paciente-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./authentication/login/login').then(c => c.Login)
  },
  {
    path: 'recuperar-contrasena',
    loadComponent: () => import('./authentication/recuperar-contrasena/recuperar-contrasena').then(c => c.RecuperarContrasena)
  },
  {
    path: 'portal',
    canActivate: [autenticacionGuard], // Solo requiere estar logueado
    loadChildren: () => import('./pages/portal/portal.routes').then(m => m.PORTAL_ROUTES)
  },
  {
    path: 'panel',
    canActivate: [autenticacionGuard], // El guard general solo verifica login
    // --- CAMBIO CLAVE ---
    // Ajustamos la carga para que funcione con 'export default'
    loadChildren: () => import('./pages/panel-control/panel-control.routes').then(m => m.default)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () => import('./core/componentes/no-encontrado/no-encontrado').then(c => c.NoEncontrado)
  }
];