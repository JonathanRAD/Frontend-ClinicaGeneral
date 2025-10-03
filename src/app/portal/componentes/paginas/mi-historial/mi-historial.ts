import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HistoriaClinicaService } from '../../../../panel-control/servicios/historia-clinica';
import { HistoriaClinica } from '../../../../panel-control/modelos/historia-clinica';
import { Spinner } from '../../../../compartido/spinner/spinner';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button'; // <-- Importar MatButtonModule

@Component({
  selector: 'app-mi-historial',
  standalone: true,
  imports: [
    CommonModule, Spinner, RouterModule, DatePipe, MatCardModule,
    MatExpansionModule, MatIconModule, MatDividerModule, MatButtonModule // <-- Añadir MatButtonModule
  ],
  templateUrl: './mi-historial.html',
  styleUrls: ['./mi-historial.css']
})
export class MiHistorial implements OnInit {
  historia = signal<HistoriaClinica | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);

  constructor(private historiaService: HistoriaClinicaService) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.historiaService.getMiHistorial().subscribe({
      next: (data) => {
        this.historia.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar tu historial clínico. Es posible que aún no tengas uno generado.');
        this.cargando.set(false);
      }
    });
  }

  // --- NUEVA FUNCIÓN PARA IMPRIMIR ---
  imprimirHistorial(): void {
    window.print();
  }
}