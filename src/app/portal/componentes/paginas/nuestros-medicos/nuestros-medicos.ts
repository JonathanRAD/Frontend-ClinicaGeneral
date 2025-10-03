// RUTA: src/app/portal/componentes/paginas/nuestros-medicos/nuestros-medicos.component.ts
import { Component, OnInit, signal, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MedicoService } from '../../../../panel-control/servicios/medico';
import { Medico } from '../../../../panel-control/modelos/medico';
import { Spinner } from '../../../../compartido/spinner/spinner';

// --- NUEVOS IMPORTS ---
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { PerfilMedicoComponent } from '../../../dialogos/perfil-medico/perfil-medico';

@Component({
  selector: 'app-nuestros-medicos',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule, Spinner,
    MatDialogModule, MatFormFieldModule, MatSelectModule, FormsModule
  ],
  templateUrl: './nuestros-medicos.html',
  styleUrls: ['./nuestros-medicos.css']
})
export class NuestrosMedicosComponent implements OnInit {
  cargando = signal(true);
  
  private medicos = signal<Medico[]>([]);
  
  // --- SEÑALES PARA EL FILTRO ---
  especialidades: Signal<string[]>;
  especialidadSeleccionada = signal<string>('todos');
  medicosFiltrados: Signal<Medico[]>;

  constructor(
    private medicoService: MedicoService,
    public dialog: MatDialog // Inyectamos MatDialog
  ) {
    this.especialidades = computed(() => 
      [...new Set(this.medicos().map(m => m.especialidad))]
    );

    this.medicosFiltrados = computed(() => {
      if (this.especialidadSeleccionada() === 'todos') {
        return this.medicos();
      }
      return this.medicos().filter(m => m.especialidad === this.especialidadSeleccionada());
    });
  }

  ngOnInit(): void {
    this.medicoService.getMedicos().subscribe(data => {
      this.medicos.set(data);
      this.cargando.set(false);
    });
  }

  // --- MÉTODO PARA ABRIR EL MODAL ---
  verPerfil(medico: Medico): void {
    this.dialog.open(PerfilMedicoComponent, {
      width: '500px',
      data: medico,
      panelClass: 'custom-dialog-container'
    });
  }
}