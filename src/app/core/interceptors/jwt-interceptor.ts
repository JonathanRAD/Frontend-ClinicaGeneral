import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AutenticacionService } from '../../services/autenticacion';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AutenticacionService);
  const token = authService.getToken(); // <-- Esto ahora funciona

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};