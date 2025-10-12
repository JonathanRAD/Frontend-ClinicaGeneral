// RUTA: src/app/panel-control/modelos/resultado-laboratorio.ts

export interface ResultadoLaboratorio {
  id: number;
  fechaResultado: Date;
  descripcion: string;
  valores: string;
  conclusiones: string;
}