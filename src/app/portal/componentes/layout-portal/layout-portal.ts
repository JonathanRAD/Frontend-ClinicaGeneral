import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../../core/componentes/navbar/navbar';
import { Footer } from '../../../core/componentes/footer/footer';

@Component({
  selector: 'app-layout-portal',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './layout-portal.html',
})
export class LayoutPortal {}