// RUTA: src/app/panel-control/modelos/patient.ts

export interface Patient {
  id: string;
  dni: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: Date;
  telefono: string;
  fotoUrl?: string;
  
  // --- NUEVOS CAMPOS AÑADIDOS ---
  peso?: number;
  altura?: number;
  ritmoCardiaco?: number;
}