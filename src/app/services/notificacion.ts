import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(private snackBar: MatSnackBar) { }

  /**
   * Muestra una notificación en pantalla.
   * @param mensaje El texto a mostrar.
   * @param tipo El estilo de la notificación: 'success', 'error', o 'info'.
   */
  mostrar(mensaje: string, tipo: 'success' | 'error' | 'info' = 'info'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`snackbar-${tipo}`]
    });
  }
}