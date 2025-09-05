// src/app/panel-control/componentes/calendario-citas/calendario-citas.ts
import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../servicios/cita';
import { Cita } from '../../modelos/cita';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-calendario-citas',
  standalone: true,
  imports: [CommonModule, RouterModule ],
  templateUrl: './calendario-citas.html',
  styleUrls: ['./calendario-citas.css']
})
export class CalendarioCitas {
  citas: Signal<Cita[]>;

  constructor(private citaService: CitaService) {
    this.citas = this.citaService.citas;
  }
}