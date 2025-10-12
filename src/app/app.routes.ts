import { Routes } from '@angular/router';
import { autenticacionGuard } from './core/guards/autenticacion-guard';
import { rolGuard } from './core/guards/rol-guard';
import { pacienteGuard } from './core/guards/paciente-guard';

export const routes: Routes = [
  // Rutas de autenticación (públicas)
  {
    path: 'login',
    loadComponent: () => import('./authentication/login/login').then(c => c.Login)
  },
  {
    path: 'recuperar-contrasena',
    loadComponent: () => import('./authentication/recuperar-contrasena/recuperar-contrasena').then(c => c.RecuperarContrasena)
  },

  // Ruta del Portal del Paciente (protegida)
  {
    path: 'portal',
    canActivate: [autenticacionGuard, pacienteGuard],
    loadChildren: () => import('./pages/portal/portal.routes').then(m => m.PORTAL_ROUTES)
  },

  // Ruta del Panel de Control (protegida)
  {
    path: 'panel',
    canActivate: [autenticacionGuard, rolGuard],
    loadChildren: () => import('./pages/panel-control/panel-control.routes').then(m => m)
  },

  // Redirección por defecto: si el usuario entra a la raíz, lo mandamos al login.
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  
  // Ruta para páginas no encontradasa
  {
    path: '**',
    loadComponent: () => import('./core/componentes/no-encontrado/no-encontrado').then(c => c.NoEncontrado)
  }
];