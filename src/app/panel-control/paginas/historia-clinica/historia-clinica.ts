import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HistoriaClinicaService } from '../../servicios/historia-clinica';
import { HistoriaClinica } from '../../modelos/historia-clinica';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormularioConsultaComponent } from '../../componentes/formulario-consulta/formulario-consulta';
import { Consulta } from '../../modelos/consulta';
import { SeguroMedicoService } from '../../servicios/seguro-medico';
import { FormularioSeguroComponent } from '../../componentes/formulario-seguro/formulario-seguro';
import { FormularioOrdenLaboratorioComponent } from '../../componentes/formulario-orden-laboratorio/formulario-orden-laboratorio';
import { LaboratorioService, OrdenLaboratorioPayload } from '../../servicios/laboratorio';
import { MatDividerModule } from '@angular/material/divider';
import { SeguroMedico } from '../../modelos/seguro-medico';

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTabsModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatExpansionModule, MatDividerModule
  ],
  templateUrl: './historia-clinica.html',
  styleUrls: ['./historia-clinica.css']
})
export class HistoriaClinicaComponent implements OnInit {

  historia = signal<HistoriaClinica | null>(null);
  pacienteId = signal<string>('');
  modoEdicion = signal<boolean>(false);
  estadoValidacion = signal<{ valido?: boolean; mensaje?: string; verificado: boolean }>({ verificado: false });

  constructor(
    private route: ActivatedRoute,
    private historiaService: HistoriaClinicaService,
    private seguroService: SeguroMedicoService,
    private laboratorioService: LaboratorioService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pacienteId.set(id);
      this.cargarHistoria();
    }
  }

  cargarHistoria(): void {
    this.historiaService.getHistoriaPorPacienteId(this.pacienteId()).subscribe({
      next: (data) => this.historia.set(data),
      error: (err) => {
        console.error('Error al cargar la historia clínica:', err);
        this.snackBar.open('No se pudo cargar la historia clínica', 'Cerrar', { duration: 3000 });
      }
    });
  }

  activarEdicion(): void {
    this.modoEdicion.set(true);
  }

  guardarCambios(): void {
    const historiaActual = this.historia();
    if (!historiaActual) return;
    const datosParaActualizar = {
      antecedentes: historiaActual.antecedentes,
      alergias: historiaActual.alergias,
      enfermedadesCronicas: historiaActual.enfermedadesCronicas
    };
    this.historiaService.actualizarHistoria(historiaActual.id, datosParaActualizar).subscribe({
      next: (historiaActualizadaParcial) => {
        this.historia.update(currentHistoria => {
          if (currentHistoria) {
            currentHistoria.antecedentes = historiaActualizadaParcial.antecedentes;
            currentHistoria.alergias = historiaActualizadaParcial.alergias;
            currentHistoria.enfermedadesCronicas = historiaActualizadaParcial.enfermedadesCronicas;
          }
          return currentHistoria;
        });
        this.modoEdicion.set(false);
        this.snackBar.open('Historia clínica actualizada con éxito', 'Cerrar', { duration: 3000 });
      },
      error: (err) => this.snackBar.open('Error al guardar los cambios', 'Cerrar', { duration: 3000 })
    });
  }

  cancelarEdicion(): void {
    this.modoEdicion.set(false);
    this.cargarHistoria();
  }

  abrirFormularioSeguro(): void {
    const seguroActual = this.historia()?.paciente.seguroMedico || null;
    const dialogRef = this.dialog.open(FormularioSeguroComponent, {
      width: '500px',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: { seguro: seguroActual }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        const seguroId = seguroActual ? seguroActual.id : undefined;
        this.seguroService.guardarSeguro(this.pacienteId(), resultado, seguroId).subscribe({
          next: (seguroGuardado: SeguroMedico) => {
            this.historia.update(historiaActual => {
              if (historiaActual) {
                const pacienteActualizado = {
                  ...historiaActual.paciente,
                  seguroMedico: seguroGuardado
                };
                return { ...historiaActual, paciente: pacienteActualizado };
              }
              return historiaActual;
            });
            this.snackBar.open('Información del seguro guardada con éxito', 'Cerrar', { duration: 3000 });
            this.estadoValidacion.set({ verificado: false });
          },
          error: (err) => this.snackBar.open('Error al guardar la información del seguro', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
  
  // --- FUNCIÓN RESTAURADA ---
  validarSeguro(): void {
    if (!this.pacienteId()) return;
    this.seguroService.validarSeguro(this.pacienteId()).subscribe({
      next: (respuesta) => {
        this.estadoValidacion.set({ ...respuesta, verificado: true });
        this.snackBar.open('Validación de seguro completada.', 'Cerrar', { duration: 2000 });
      },
      error: (err) => this.estadoValidacion.set({ valido: false, mensaje: 'No se encontró información del seguro.', verificado: true })
    });
  }
  
  abrirFormularioConsulta(): void {
    const dialogRef = this.dialog.open(FormularioConsultaComponent, {
      width: '600px',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(resultado => {
      const historiaActual = this.historia();
      if (resultado && historiaActual) {
        this.historiaService.agregarConsulta(historiaActual.id, resultado).subscribe({
          next: (nuevaConsulta) => {
            this.historia.update(hist => {
              if (!hist) return null;
              const consultasActualizadas = [...(hist.consultas || []), nuevaConsulta];
              return { ...hist, consultas: consultasActualizadas };
            });
            this.snackBar.open('Consulta registrada con éxito', 'Cerrar', { duration: 3000 });
          },
          error: (err) => this.snackBar.open('Error al registrar la consulta', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }

  abrirFormularioOrden(consultaId: number): void {
    const dialogRef = this.dialog.open(FormularioOrdenLaboratorioComponent, {
      width: '550px',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: { consultaId }
    });
    dialogRef.afterClosed().subscribe((resultado: OrdenLaboratorioPayload) => {
      if (resultado) {
        this.laboratorioService.crearOrden(consultaId, resultado).subscribe({
          next: (nuevaOrden) => {
            this.historia.update(currentHistoria => {
              if (!currentHistoria) return null;
              const nuevasConsultas = currentHistoria.consultas.map(consulta => {
                if (consulta.id === consultaId) {
                  return {
                    ...consulta,
                    ordenesLaboratorio: [...(consulta.ordenesLaboratorio || []), nuevaOrden]
                  };
                }
                return consulta;
              });
              return { ...currentHistoria, consultas: nuevasConsultas };
            });
            this.snackBar.open('Orden de laboratorio creada con éxito', 'Cerrar', { duration: 3000 });
          },
          error: (err) => this.snackBar.open('No se pudo crear la orden', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }
  
  trackByConsultaId(index: number, consulta: Consulta): number {
    return consulta.id;
  }
}