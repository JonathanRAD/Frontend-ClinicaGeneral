import { Routes } from '@angular/router';
import { LayoutComponent } from './componentes-panel/layout/layout';
import { Inicio } from './paginas-panel/inicio/inicio';
import { GestionPacientes } from './paginas-panel/gestion-pacientes/gestion-pacientes';
import { CalendarioCitas } from './paginas-panel/calendario-citas/calendario-citas';
import { GestionFacturacion } from './paginas-panel/gestion-facturacion/gestion-facturacion';
import { GestionMedicos } from './paginas-panel/gestion-medicos/gestion-medicos';
import { GestionConfiguracion } from './paginas-panel/gestion-configuracion/gestion-configuracion';
import { HistoriaClinicaComponent } from './paginas-panel/historia-clinica/historia-clinica';
import { GestionReportesComponent } from './componentes-panel/gestion-reportes/gestion-reportes';
import { MiPerfilComponent } from './paginas-panel/mi-perfil/mi-perfil';
import { GestionUsuariosComponent } from './paginas-panel/gestion-usuarios/gestion-usuarios';

// Importamos nuestro nuevo guard de permisos
import { permissionGuard } from '../../core/guards/permission-guard';

// Mantenemos la estructura de exportación por defecto
export default [
  {
    path: '',
    component: LayoutComponent,
    children: [
      // Rutas que todos los usuarios del panel pueden ver
      { path: 'inicio', component: Inicio },
      { path: 'mi-perfil', component: MiPerfilComponent },

      // --- INICIO DE RUTAS PROTEGIDAS POR PERMISOS ---

      {
        path: 'pacientes',
        component: GestionPacientes,
        canActivate: [permissionGuard],
        data: { permiso: 'GESTIONAR_PACIENTES' }
      },
      {
        path: 'pacientes/:id/historia', // Mantenemos tu ruta correcta
        component: HistoriaClinicaComponent,
        canActivate: [permissionGuard],
        data: { permiso: 'VER_HISTORIA_CLINICA_AJENA' }
      },
      {
        path: 'citas',
        component: CalendarioCitas,
        canActivate: [permissionGuard],
        data: { permiso: 'GESTIONAR_CITAS' }
      },
      {
        path: 'facturacion',
        component: GestionFacturacion,
        canActivate: [permissionGuard],
        data: { permiso: 'GESTIONAR_FACTURAS' }
      },
      {
        path: 'medicos',
        component: GestionMedicos,
        canActivate: [permissionGuard],
        data: { permiso: 'GESTIONAR_MEDICOS' }
      },
      {
        path: 'usuarios',
        component: GestionUsuariosComponent,
        canActivate: [permissionGuard],
        data: { permiso: 'GESTIONAR_USUARIOS' }
      },
      {
        path: 'reportes',
        component: GestionReportesComponent,
        canActivate: [permissionGuard],
        data: { permiso: 'GESTIONAR_USUARIOS' } // O un permiso específico como 'VER_REPORTES'
      },
      {
        path: 'configuracion',
        component: GestionConfiguracion,
        canActivate: [permissionGuard],
        data: { permiso: 'GESTIONAR_SEGUROS' } // O un permiso 'CONFIGURAR_SISTEMA'
      },

      // --- FIN DE RUTAS PROTEGIDAS ---

      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ]
  }
] as Routes;