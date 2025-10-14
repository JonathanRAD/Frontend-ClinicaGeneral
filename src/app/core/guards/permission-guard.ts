import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion';

/**
 * Un guard que verifica si el usuario autenticado tiene un permiso específico.
 * El permiso requerido se debe pasar en la propiedad `data` de la ruta.
 *
 * Ejemplo en la definición de la ruta:
 * {
 * path: 'gestion-usuarios',
 * component: GestionUsuariosComponent,
 * canActivate: [permissionGuard],
 * data: { permiso: 'GESTIONAR_USUARIOS' } // <-- Permiso requerido
 * }
 */
export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AutenticacionService);
  const router = inject(Router);

  // Obtenemos el permiso requerido desde la data de la ruta
  const permisoRequerido = route.data['permiso'];

  if (!permisoRequerido) {
    // Error de configuración: la ruta protegida no especificó qué permiso necesita.
    console.error('Error de configuración de ruta: No se especificó el permiso en la propiedad "data".');
    router.navigate(['/panel/inicio']); // Redirigir a una página segura
    return false;
  }

  if (authService.tienePermiso(permisoRequerido)) {
    // El usuario tiene el permiso, puede pasar.
    return true;
  } else {
    // El usuario no tiene el permiso, redirigir.
    console.warn(`Acceso denegado. Se requiere el permiso: ${permisoRequerido}`);
    router.navigate(['/panel/inicio']); // O a una página de "acceso denegado"
    return false;
  }
};