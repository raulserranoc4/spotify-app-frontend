import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
// Importa Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { HeaderComponent } from './components/layout/header/header.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    HomeComponent,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    HeaderComponent,
    MatGridListModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      // Si no hay token, redirigir al login de Spotify
      console.log('holiu');
      window.open('http://localhost:3000/auth/login', '_blank');
    }
  }
  message: string = 'Cargando...'; // Mensaje inicial

  title = 'Spotify App';
}
