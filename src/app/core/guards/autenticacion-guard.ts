// src/app/core/guards/autenticacion.guard.ts
import { inject } from '@angular/core';
// 1. Importa UrlTree
import { CanActivateFn, Router, UrlTree } from '@angular/router'; 
import { AutenticacionService } from '../servicios/autenticacion';

// 2. Actualiza el tipo de retorno
export const autenticacionGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  
  const authService = inject(AutenticacionService);
  const router = inject(Router);

  if (authService.estaLogueado()) {
    return true; // Permite el acceso
  }
  
  // 3. En lugar de navegar y retornar false, retorna un UrlTree
  // Esto le dice al enrutador: "Redirige a /login"
  return router.createUrlTree(['/login']);
};