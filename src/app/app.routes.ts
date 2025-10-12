import { Routes } from '@angular/router';
import { autenticacionGuard } from './core/guards/autenticacion-guard';
import { rolGuard } from './core/guards/rol-guard';
import { pacienteGuard } from './core/guards/paciente-guard';

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
    canActivate: [autenticacionGuard, pacienteGuard],
    loadChildren: () => import('./pages/portal/portal.routes').then(m => m.PORTAL_ROUTES)
  },
  {
    path: 'panel',
    canActivate: [autenticacionGuard, rolGuard],
    loadChildren: () => import('./pages/panel-control/panel-control.routes').then(m => m)
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