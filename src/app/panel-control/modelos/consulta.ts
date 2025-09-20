import { Medico } from './medico';

export interface Consulta {
  id: number;
  fechaConsulta: Date;
  motivo: string;
  diagnostico: string;
  tratamiento: string;
  medico: Medico;
  // No incluimos la referencia a HistoriaClinica para evitar bucles
}