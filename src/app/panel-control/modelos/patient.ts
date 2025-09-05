export interface Patient {
  id: string;
  dni: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: Date;
  telefono: string;
  fotoUrl?: string; 
}