
import { Component, computed, Signal, AfterViewInit, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button'; 
import { Chart } from 'chart.js/auto';

import { PacienteService } from '../../../../services/paciente';
import { CitaService } from '../../../../services/cita';
import { FacturacionService } from '../../../../services/facturacion';
import { Cita } from '../../../../core/models/cita';
import { Factura } from '../../../../core/models/factura';
import { Patient } from '../../../../core/models/patient';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [ CommonModule, RouterModule, MatCardModule, MatIconModule, MatListModule, MatButtonModule ],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class Inicio implements AfterViewInit {
  @ViewChild('ingresosChart') ingresosChartCanvas!: ElementRef<HTMLCanvasElement>;
  
  totalPacientes: Signal<number>;
  citasHoy: Signal<number>;
  ingresosMesActual: Signal<number>;

  ultimosPacientes: Signal<Patient[]>;
  citasCompletadasRecientes: Signal<Cita[]>;
  private ingresosPorMesData: Signal<{ labels: string[], data: number[] }>;

  private ingresosChartInstance?: Chart;
  fechaActual = new Date();

  constructor(
    private pacienteService: PacienteService,
    private citaService: CitaService,
    private facturacionService: FacturacionService
  ) {
    this.totalPacientes = computed(() => this.pacienteService.pacientes().length);
    this.citasHoy = computed(() => this.getCitasDeHoy());
    this.ingresosMesActual = computed(() => this.getIngresosMesActual());

    this.ultimosPacientes = computed(() => 
      this.pacienteService.pacientes().slice(-3).reverse()
    );

    this.citasCompletadasRecientes = computed(() => 
      this.citaService.citas()
        .filter(c => c.estado === 'completada')
        .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime())
        .slice(0, 3)
    );

    this.ingresosPorMesData = computed(() => this.procesarIngresosPorMes());

    effect(() => {
      this.actualizarGraficoIngresos();
    });
  }

  ngAfterViewInit(): void {
    this.crearGraficoIngresos();
  }

  private getCitasDeHoy(): number {
    const hoy = new Date().setHours(0, 0, 0, 0);
    return this.citaService.citas().filter(c => new Date(c.fechaHora).setHours(0, 0, 0, 0) === hoy).length;
  }
  private getIngresosMesActual(): number {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    return this.facturacionService.facturas()
      .filter(f => new Date(f.fechaEmision) >= primerDiaMes && f.estado === 'pagada')
      .reduce((sum: number, factura: Factura) => sum + factura.monto, 0);
  }
  
  private procesarIngresosPorMes(): { labels: string[], data: number[] } {
    const conteo = Array(12).fill(0);
    this.facturacionService.facturas()
      .filter(f => f.estado === 'pagada')
      .forEach(factura => {
        const mes = new Date(factura.fechaEmision).getMonth();
        conteo[mes] += factura.monto;
      });
    const labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return { labels, data: conteo };
  }

  private crearGraficoIngresos(): void {
    if (!this.ingresosChartCanvas) return;
    const datos = this.ingresosPorMesData();
    this.ingresosChartInstance = new Chart(this.ingresosChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: datos.labels,
        datasets: [{
          label: 'Ingresos por Mes (S/)',
          data: datos.data,
          borderColor: '#198754',
          backgroundColor: 'rgba(25, 135, 84, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });
  }
  
  private actualizarGraficoIngresos(): void {
    if (this.ingresosChartInstance) {
      const datos = this.ingresosPorMesData();
      this.ingresosChartInstance.data.datasets[0].data = datos.data;
      this.ingresosChartInstance.update('none');
    }
  }
}