// RUTA: src/app/portal/componentes/paginas/inicio-portal/inicio-portal.component.ts

import { Component, OnInit, signal, computed, Signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list'; // <-- Importar MatListModule
import { AutenticacionService } from '../../../../core/servicios/autenticacion';
import { CitaService } from '../../../../panel-control/servicios/cita';
import { Cita } from '../../../../panel-control/modelos/cita';

@Component({
  selector: 'app-inicio-portal',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule // <-- Añadir MatListModule a los imports
  ],
  templateUrl: './inicio-portal.html',
  styleUrls: ['./inicio-portal.css']
})
export class InicioPortalComponent implements OnInit {
  nombreUsuario = signal('');
  proximaCita: Signal<Cita | undefined>;

  // --- NUEVO: Señal para la última cita completada ---
  ultimaCitaCompletada: Signal<Cita | undefined>;

  // --- NUEVO: Señal para el consejo del día ---
  consejoDelDia = signal<{ titulo: string; contenido: string; icon: string; }>({ titulo: '', contenido: '', icon: '' });

  private citas = signal<Cita[]>([]);
  private consejos = [
    { titulo: 'Mantente Hidratado', contenido: 'Beber suficiente agua durante el día es clave para tu energía y bienestar general.', icon: 'water_drop' },
    { titulo: 'Pausa Activa', contenido: 'Si trabajas sentado, levántate y estira cada hora para mejorar tu circulación.', icon: 'self_improvement' },
    { titulo: 'Descanso es Clave', contenido: 'Asegúrate de dormir entre 7 y 8 horas cada noche para una buena salud física y mental.', icon: 'bedtime' },
    { titulo: 'Snacks Saludables', contenido: 'Opta por frutas o frutos secos en lugar de snacks procesados para mantener tu energía.', icon: 'restaurant' }
  ];

  constructor(
    private authService: AutenticacionService,
    private citaService: CitaService
  ) {
    this.nombreUsuario.set(this.authService.getNombreUsuario()?.split('@')[0] || 'Paciente');

    // Cómputo para la próxima cita (sin cambios)
    this.proximaCita = computed(() => {
      const ahora = new Date();
      return this.citas()
        .filter(c => new Date(c.fechaHora) > ahora && c.estado.toLowerCase() === 'programada')
        .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())[0];
    });

    // --- NUEVO: Cómputo para la última cita completada ---
    this.ultimaCitaCompletada = computed(() => {
      return this.citas()
        .filter(c => c.estado.toLowerCase() === 'completada')
        .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime())[0];
    });
  }

  ngOnInit(): void {
    this.citaService.getMisCitas().subscribe(data => this.citas.set(data));
    // --- NUEVO: Seleccionar un consejo al azar al iniciar ---
    this.consejoDelDia.set(this.consejos[Math.floor(Math.random() * this.consejos.length)]);
  }
}