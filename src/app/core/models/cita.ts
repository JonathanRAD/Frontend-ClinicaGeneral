
import { Patient } from './patient';
import { Medico } from './medico';

export interface Cita {
  id: string;
  fechaHora: Date;
  paciente: Patient;
  medico: Medico;
  motivo: string;
  estado: 'programada' | 'completada' | 'cancelada';

  consultorio?: string; 
  numeroTurno?: number;  

  tiempoRestante?: string;
  alertaClase?: 'rojo' | 'ambar' | 'verde';
}