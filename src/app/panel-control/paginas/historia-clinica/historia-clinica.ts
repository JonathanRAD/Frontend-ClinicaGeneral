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
import { SeguroMedico } from '../../modelos/seguro-medico';

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule, 
    MatExpansionModule
  ],
  templateUrl: './historia-clinica.html',
  styleUrls: ['./historia-clinica.css']
})
export class HistoriaClinicaComponent implements OnInit {

  // Usamos signals para manejar el estado de forma reactiva
  historia = signal<HistoriaClinica | null>(null);
  pacienteId = signal<string>('');
  modoEdicion = signal<boolean>(false);
  estadoValidacion = signal<{ valido?: boolean; mensaje?: string; verificado: boolean }>({ verificado: false });


  constructor(
    private route: ActivatedRoute,
    private historiaService: HistoriaClinicaService,
    private seguroService: SeguroMedicoService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Obtenemos el ID del paciente desde la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pacienteId.set(id);
      this.cargarHistoria();
    }
  }

  cargarHistoria(): void {
    this.historiaService.getHistoriaPorPacienteId(this.pacienteId()).subscribe({
      next: (data) => {
        this.historia.set(data);
        console.log('Historia Clínica cargada:', data);
      },
      error: (err) => {
        console.error('Error al cargar la historia clínica:', err);
        this.snackBar.open('No se pudo cargar la historia clínica', 'Cerrar', { duration: 3000 });
      }
    });
  }

  activarEdicion(): void {
    this.modoEdicion.set(true);
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
        this.seguroService.guardarSeguro(this.pacienteId(), resultado).subscribe({
          next: (seguroGuardado) => {
            // Actualizamos la historia localmente para reflejar el cambio al instante
            this.historia.update(historiaActual => {
              if (historiaActual) {
                historiaActual.paciente.seguroMedico = seguroGuardado;
              }
              return historiaActual;
            });
            this.snackBar.open('Información del seguro guardada con éxito', 'Cerrar', { duration: 3000 });
            this.estadoValidacion.set({ verificado: false }); // Resetea el estado de validación
          },
          error: (err) => {
            this.snackBar.open('Error al guardar la información del seguro', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }
  validarSeguro(): void {
    if (!this.pacienteId()) return;

    this.seguroService.validarSeguro(this.pacienteId()).subscribe({
      next: (respuesta) => {
        this.estadoValidacion.set({ ...respuesta, verificado: true });
        this.snackBar.open('Validación de seguro completada.', 'Cerrar', { duration: 2000 });
      },
      error: (err) => {
        this.estadoValidacion.set({ valido: false, mensaje: 'No se encontró información del seguro para validar.', verificado: true });
      }
    });
  }

  guardarCambios(): void {
    if (!this.historia()) return;

    const historiaActual = this.historia()!;
    const datosParaActualizar = {
      antecedentes: historiaActual.antecedentes,
      alergias: historiaActual.alergias,
      enfermedadesCronicas: historiaActual.enfermedadesCronicas
    };

    this.historiaService.actualizarHistoria(historiaActual.id, datosParaActualizar).subscribe({
      next: (historiaActualizada) => {
        this.historia.set(historiaActualizada);
        this.modoEdicion.set(false);
        this.snackBar.open('Historia clínica actualizada con éxito', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error al actualizar la historia clínica:', err);
        this.snackBar.open('Error al guardar los cambios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  

  cancelarEdicion(): void {
    this.modoEdicion.set(false);
    // Opcional: Recargar los datos originales para descartar cambios no guardados
    this.cargarHistoria();
  }
  abrirFormularioConsulta(): void {
    const dialogRef = this.dialog.open(FormularioConsultaComponent, {
      width: '600px',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado && this.historia()) {
        const historiaId = this.historia()!.id;
        
        // --- SECCIÓN CORREGIDA ---
        this.historiaService.agregarConsulta(historiaId, resultado).subscribe({
          next: (nuevaConsulta: Consulta) => { // <-- Se añade el tipo 'Consulta'
            this.historia.update(historiaActual => {
              if (historiaActual) {
                // Aseguramos que el array de consultas exista antes de añadir una nueva
                const consultasActuales = historiaActual.consultas || [];
                historiaActual.consultas = [...consultasActuales, nuevaConsulta];
              }
              return historiaActual;
            });
            this.snackBar.open('Consulta registrada con éxito', 'Cerrar', { duration: 3000 });
          },
          error: (err: any) => { // <-- Se añade el tipo 'any' para el error
            console.error('Error al registrar la consulta:', err);
            this.snackBar.open('Error al registrar la consulta', 'Cerrar', { duration: 3000 });
          }
        });
        // --- FIN DE SECCIÓN CORREGIDA ---
      }
    });
  }
}