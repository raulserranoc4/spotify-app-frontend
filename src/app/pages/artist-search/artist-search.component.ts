import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-artist-search',
  templateUrl: './artist-search.component.html',
  imports: [CommonModule, MatListModule, MatCardModule, MatIconModule],
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

  public obtainImage() {
    // this.showTemplates()
    this.downloadImageWithText(
      'templates/white_ticket.png',
      this.topTracksLastWeek, // aquí puedes usar variables dinámicas
      'black',
      true
    );
  }

  downloadImageWithText(
    backgroundUrl: string, // ruta o base64 de la imagen
    tracks: any[], // el texto que quieres poner
    textColor: string = 'white', // color del texto
    lastWeek: boolean
  ) {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // para evitar problemas con CORS si la imagen está en otro servidor
    img.src = backgroundUrl;

    console.log('Image: ', img);

    img.onload = () => {
      // Crear un canvas del tamaño de la imagen
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Dibujar la imagen de fondo
      ctx.drawImage(img, 0, 0);

      // Configurar estilo del texto
      ctx.font = "70px 'Courier New', monospace";
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Dibujar el texto (centrado en la imagen)
      ctx.fillText('Wrappify', canvas.width / 2, canvas.height / 6);

      ctx.font = "40px 'Courier New', monospace";

      if (lastWeek) {
        ctx.fillText('LAST WEEK', canvas.width / 2, canvas.height / 4.5);
      } else {
        ctx.fillText('LAST MONTH', canvas.width / 2, canvas.height / 5);
      }

      ctx.font = "30px 'Courier New', monospace";

      for (let [index, track] of tracks.entries()) {
        const trackHeight = (canvas.height * (index / 1.5 + 6)) / 20;
        ctx.fillText(track.name, canvas.width / 2, trackHeight);
      }

      // Crear link para descargar la imagen
      const link = document.createElement('a');
      link.download = 'imagen-con-texto.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  }
}
