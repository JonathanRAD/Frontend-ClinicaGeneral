

import { Cita } from './cita';

export interface Factura {
  id: string;
  cita: Cita;
  monto: number;
  fechaEmision: Date;
  estado: 'pagada' | 'pendiente' | 'anulada';
}