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
      // '../../../../assets/templates/white_ticket.png',
      '/assets/templates/white_ticket.png',
      `Hola ${this.topTracksLastWeek[0].name}!`, // aquí puedes usar variables dinámicas
      "50px 'Times New Roman'",
      'yellow'
    );
  }

  downloadImageWithText(
    backgroundUrl: string, // ruta o base64 de la imagen
    text: string, // el texto que quieres poner
    font: string = '40px Arial', // fuente y tamaño
    textColor: string = 'white' // color del texto
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
      ctx.font = font;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Dibujar el texto (centrado en la imagen)
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      // Crear link para descargar la imagen
      const link = document.createElement('a');
      link.download = 'imagen-con-texto.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  }
}
