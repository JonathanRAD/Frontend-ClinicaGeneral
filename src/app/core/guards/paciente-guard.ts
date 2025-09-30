import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../servicios/autenticacion';

export const pacienteGuard: CanActivateFn = () => {
  const authService = inject(AutenticacionService);
  const router = inject(Router);
  const rol = authService.rolUsuario();

  // Si el rol es PACIENTE, permite el acceso.
  if (rol === 'PACIENTE') {
    return true;
  }
  
  // Si es personal, lo redirigimos a su panel.
  return router.createUrlTree(['/panel']);
};