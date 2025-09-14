// RUTA: src/app/panel-control/modelos/cita.ts

import { Patient } from './patient';
import { Medico } from './medico';

export interface Cita {
  id: string;
  fechaHora: Date;
  paciente: Patient;
  medico: Medico;
  motivo: string;
  estado: 'programada' | 'completada' | 'cancelada';

  // --- NUEVOS CAMPOS AÑADIDOS ---
  tiempoRestante?: string; // Para el texto "En 2 días"
  alertaClase?: 'rojo' | 'ambar' | 'verde'; // Para el color de la alerta
}