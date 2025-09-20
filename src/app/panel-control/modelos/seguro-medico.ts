// RUTA: src/app/panel-control/modelos/seguro-medico.ts

import { Patient } from './patient';

export interface SeguroMedico {
  id: number;
  nombreAseguradora: string;
  numeroPoliza: string;
  cobertura: string;
  paciente?: Patient;
}