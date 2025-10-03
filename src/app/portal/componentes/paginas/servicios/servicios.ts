// RUTA: src/app/portal/componentes/paginas/servicios/servicios.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './servicios.html',
  styleUrls: ['./servicios.css']
})
export class ServiciosComponent {
  servicios = [
    { icon: 'cardiology', nombre: 'Cardiología', desc: 'Cuidado integral del corazón, diagnóstico y tratamiento de enfermedades cardiovasculares.' },
    { icon: 'child_care', nombre: 'Pediatría', desc: 'Atención médica completa para bebés, niños y adolescentes.' },
    { icon: 'medical_services', nombre: 'Medicina General', desc: 'Diagnóstico y tratamiento para una amplia gama de dolencias comunes.' },
    { icon: 'masks', nombre: 'Dermatología', desc: 'Cuidado experto para tu piel, cabello y uñas, tratando condiciones y realizando procedimientos estéticos.' },
    { icon: 'pregnant_woman', nombre: 'Ginecología', desc: 'Salud reproductiva femenina, control prenatal y tratamiento de enfermedades ginecológicas.' },
    { icon: 'psychology', nombre: 'Neurología', desc: 'Estudio y tratamiento de trastornos del sistema nervioso central y periférico.' }
  ];
}