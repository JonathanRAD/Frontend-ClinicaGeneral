// RUTA: src/app/panel-control/modelos/orden-laboratorio.ts

import { ResultadoLaboratorio } from './resultado-laboratorio';

export interface OrdenLaboratorio {
  id: number;
  fechaOrden: Date;
  tipoExamen: string;
  observaciones: string;
  resultadoLaboratorio?: ResultadoLaboratorio; // El resultado puede ser opcional
}