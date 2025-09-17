// RUTA: src/app/app.routes.ts
import { Routes } from '@angular/router';
import { autenticacionGuard } from './core/guards/autenticacion-guard';

export const routes: Routes = [
  // RUTAS ESPECÍFICAS (login, etc.) VAN PRIMERO
  {
    path: 'login',
    loadComponent: () => import('./autenticacion/paginas/login/login').then(c => c.Login)
  },
  {
    path: 'recuperar-contrasena',
    loadComponent: () => import('./autenticacion/paginas/recuperar-contrasena/recuperar-contrasena').then(c => c.RecuperarContrasena)
  },

  // RUTAS DE MÓDULOS
  {
    path: 'inicio',
    loadChildren: () => import('./publico/publico.routes').then(m => m)
  },
  {
    path: 'panel',
    canActivate: [autenticacionGuard],
    loadChildren: () => import('./panel-control/panel-control.routes').then(m => m)
  },

  // --- AÑADE ESTE BLOQUE AQUÍ ---
  // Esta es la nueva regla. Si la ruta está vacía, redirige a '/inicio'.
  // Debe estar DESPUÉS de las rutas específicas y ANTES del comodín.
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },
  // --- FIN DEL BLOQUE AÑADIDO ---

  // RUTA COMODÍN (siempre al final)
  {
    path: '**',
    loadComponent: () => import('./core/componentes/no-encontrado/no-encontrado').then(c => c.NoEncontrado)
  }
];