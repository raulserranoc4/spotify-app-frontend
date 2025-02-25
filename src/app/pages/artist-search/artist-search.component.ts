import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artist-search',
  templateUrl: './artist-search.component.html',
  imports: [CommonModule, MatListModule, MatCardModule],
  styleUrls: ['./artist-search.component.scss'],
})
export class ArtistSearchComponent implements OnInit {
  constructor(private apiService: ApiService) {}

  public topTracksLastWeek: any[] = [];
  public topTracksLastMonth: any[] = [];

  ngOnInit(): void {
    // Obtener las canciones más escuchadas en la última semana
    this.apiService.getTopTracksLastWeek().subscribe(
      (data) => (this.topTracksLastWeek = data.items),
      (error) =>
        console.error('Error obteniendo top tracks (última semana)', error)
    );

    // Obtener las canciones más escuchadas en el último mes
    this.apiService.getTopTracksLastMonth().subscribe(
      (data) => (this.topTracksLastMonth = data.items),
      (error) =>
        console.error('Error obteniendo top tracks (último mes)', error)
    );
  }
}
