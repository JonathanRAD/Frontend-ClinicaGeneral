// RUTA: src/app/core/guards/permiso-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion';

export const permisoGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AutenticacionService);
  const router = inject(Router);

  // Obtenemos el permiso requerido desde la data de la ruta
  const permisoRequerido = route.data['permiso'];

  // Si no se especificó un permiso, por seguridad, bloqueamos el acceso.
  if (!permisoRequerido) {
    console.error('No se ha definido un permiso para esta ruta.');
    router.navigate(['/panel/inicio']); // O a una página de "acceso denegado"
    return false;
  }

  // Usamos la función que ya tenemos en el servicio de autenticación
  if (authService.tienePermiso(permisoRequerido)) {
    return true; // El usuario tiene el permiso, puede pasar.
  } else {
    // El usuario no tiene el permiso, lo redirigimos.
    console.warn(`Acceso denegado. Se requiere el permiso: ${permisoRequerido}`);
    router.navigate(['/panel/inicio']); // Redirigir al inicio del panel
    return false;
  }
};