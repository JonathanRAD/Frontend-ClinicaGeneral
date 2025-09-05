// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { autenticacionGuard } from './core/guards/autenticacion-guard';
export const routes: Routes = [
  // RUTA DE LOGIN: Clara y específica
  {
    path: 'login',
    loadComponent: () => import('./autenticacion/paginas/login/login').then(c => c.Login)
  },

   // --- NUEVA RUTA AQUÍ ---
  {
    path: 'recuperar-contrasena',
    loadComponent: () => import('./autenticacion/paginas/recuperar-contrasena/recuperar-contrasena').then(c => c.RecuperarContrasena)
  },
  // --- FIN DE LA NUEVA RUTA ---
  // SECCIÓN PÚBLICA: Ahora tiene su propio prefijo "inicio"
  {
    path: 'inicio',
    loadChildren: () => import('./publico/publico.routes').then(m => m)
  },

  // SECCIÓN PROTEGIDA: Con su prefijo "panel" y el guardia
  {
    path: 'panel',
    canActivate: [autenticacionGuard],
    loadChildren: () => import('./panel-control/panel-control.routes').then(m => m)
  },


  // RUTA COMODÍN: Siempre al final para páginas no encontradas
  {
    path: '**',
    loadComponent: () => import('./core/componentes/no-encontrado/no-encontrado').then(c => c.NoEncontrado)
  }
];