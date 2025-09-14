// RUTA: src/app/panel-control/modelos/cita.ts

import { Patient } from './patient';
import { Medico } from './medico';

// La línea "import { Cita } from '../modelos/cita';" ha sido eliminada.

export interface Cita {
  id: string;
  fechaHora: Date;
  paciente: Patient;
  medico: Medico;
  motivo: string;
  estado: 'programada' | 'completada' | 'cancelada';
}