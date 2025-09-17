import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true, // <-- ESTA LÍNEA ES CRUCIAL
  imports: [
    RouterModule    // <-- Y ESTE IMPORT ES CRUCIAL
  ],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class Footer {
  // Lógica del componente
}