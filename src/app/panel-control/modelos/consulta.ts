

import { Medico } from './medico';
import { OrdenLaboratorio } from './orden-laboratorio'; 

export interface Consulta {
  id: number;
  fechaConsulta: Date;
  motivo: string;
  diagnostico: string;
  tratamiento: string;
  medico: Medico;
  ordenesLaboratorio?: OrdenLaboratorio[]; 
}