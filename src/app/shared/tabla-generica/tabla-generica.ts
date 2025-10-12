import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card'; 
import { DatePipe } from '@angular/common';
import { Patient } from '../../core/models/patient';
import { RouterModule } from '@angular/router';



export interface ColumnConfig {
  name: string; 
  header: string; 
  isDate?: boolean;
}

@Component({
  selector: 'app-tabla-generica',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule, 
    MatInputModule,
    MatCardModule,
    DatePipe  
  ],
  templateUrl: './tabla-generica.html',
  styleUrls: ['./tabla-generica.css']
})
export class TablaGenerica implements AfterViewInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columnConfig: ColumnConfig[] = [];
  @Input() title: string = 'Lista';
  @Input() addButtonText?: string;
  @Input() nameProperties: [string, string] = ['', ''];
  @Input() idProperty: string = 'id';
  @Input() showClinicalHistoryButton: boolean = false;


  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<void>(); 
  @Output() onRowClicked = new EventEmitter<any>();
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data;
    }
    if (changes['columnConfig'] || changes['nameProperties']) {
      const hasInitialsAvatar = this.nameProperties && this.nameProperties[0] && this.nameProperties[1];
      let columnsToDisplay = this.columnConfig.map(c => c.name);
      
      if (hasInitialsAvatar) {
        this.displayedColumns = ['avatar', ...columnsToDisplay, 'acciones'];
      } else {
        this.displayedColumns = [...columnsToDisplay, 'acciones'];
      }
    }
  }

  getInitials(element: any): string {
    const firstName = element[this.nameProperties[0]] || '';
    const lastName = element[this.nameProperties[1]] || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getAvatarColor(element: any): string {
    const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6', '#1abc9c'];
    const id = element[this.idProperty] || 'default';
    const index = id.toString().charCodeAt(0) % colors.length;
    return colors[index];
  }
onVerHistoria(paciente: Patient) {
    console.log('Navegando a la historia del paciente:', paciente.id);
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  resolveNestedPath(obj: any, path: string): any {
    return path.split('.').reduce((p, c) => (p && p[c]) ? p[c] : null, obj);
  }

  agregarNuevo() {
    this.onAdd.emit();
  }
  editar(element: any) {
    this.onEdit.emit(element);
  }

  eliminar(element: any) {
    this.onDelete.emit(element);
  }
  
}