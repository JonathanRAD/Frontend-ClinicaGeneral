import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../servicios/autenticacion';

export const rolGuard: CanActivateFn = () => {
  const authService = inject(AutenticacionService);
  const router = inject(Router);
  const rol = authService.rolUsuario();

  // Si el rol NO es de paciente, permite el acceso.
  if (rol && rol !== 'PACIENTE') {
    return true;
  }
  
  // Si es un paciente, lo redirigimos a su portal.
  return router.createUrlTree(['/portal']);
};