// RUTA: src/app/panel-control/servicios/seguro-medico.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { SeguroMedico } from '../modelos/seguro-medico';

@Injectable({
  providedIn: 'root'
})
export class SeguroMedicoService {
  private apiUrl = `${environment.apiUrl}/seguros`;

  constructor(private http: HttpClient) { }

  guardarSeguro(pacienteId: string, seguroData: any): Observable<SeguroMedico> {
    return this.http.post<SeguroMedico>(`${this.apiUrl}/paciente/${pacienteId}`, seguroData);
  }

  validarSeguro(pacienteId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/validar/paciente/${pacienteId}`);
  }
}