import { Component, OnInit, signal, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MedicoService } from '../../../../services/medico';
import { Medico } from '../../../../core/models/medico';
import { Spinner } from '../../../../shared/spinner/spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { PerfilMedicoComponent } from '../../componentes-portal/perfil-medico/perfil-medico';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuestros-medicos',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule, Spinner,
    MatDialogModule, MatFormFieldModule, MatSelectModule, FormsModule,
    MatInputModule, MatButtonModule
  ],
  templateUrl: './nuestros-medicos.html',
  styleUrls: ['./nuestros-medicos.css']
})
export class NuestrosMedicosComponent implements OnInit {
  cargando = signal(true);
  
  private medicos = signal<Medico[]>([]);
  
  especialidades: Signal<string[]>;
  especialidadSeleccionada = signal<string>('todos');
  nombreBusqueda = signal<string>('');
  medicosFiltrados: Signal<Medico[]>;

  constructor(
    private medicoService: MedicoService,
    public dialog: MatDialog,
    private router: Router 
  ) {
    this.especialidades = computed(() => 
      [...new Set(this.medicos().map(m => m.especialidad))].sort()
    );

    this.medicosFiltrados = computed(() => {
      const especialidad = this.especialidadSeleccionada();
      const busqueda = this.nombreBusqueda().toLowerCase();

      return this.medicos().filter(medico => {
        const porEspecialidad = especialidad === 'todos' || medico.especialidad === especialidad;
        const porNombre = `${medico.nombres} ${medico.apellidos}`.toLowerCase().includes(busqueda);
        return porEspecialidad && porNombre;
      });
    });
  }

  ngOnInit(): void {
    this.medicoService.getMedicos().subscribe(data => {
      this.medicos.set(data);
      this.cargando.set(false);
    });
  }

  verPerfil(medico: Medico): void {
    this.dialog.open(PerfilMedicoComponent, {
      width: '500px',
      data: medico,
      panelClass: 'custom-dialog-container'
    });
  }
  
  agendarCitaConMedico(medico: Medico): void {
    this.router.navigate(['/portal/agendar-cita'], { queryParams: { medicoId: medico.id } });
  }
}