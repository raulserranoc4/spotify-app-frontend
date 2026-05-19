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
    this.apiService.getTopTracksLastWeek().subscribe(
      (data) => (this.topTracksLastWeek = data.items),
      (error) =>
        console.error('Error obteniendo top tracks (ultima semana)', error)
    );

    this.apiService.getTopTracksLastMonth().subscribe(
      (data) => (this.topTracksLastMonth = data.items),
      (error) =>
        console.error('Error obteniendo top tracks (ultimo mes)', error)
    );
  }

  public obtainImage() {
    this.downloadWeeklyTopTracksTemplate(this.topTracksLastWeek.slice(0, 10));
  }

  private downloadWeeklyTopTracksTemplate(tracks: any[]) {
    if (!tracks.length) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.drawTemplateBackground(ctx, canvas.width, canvas.height);
    this.drawTemplateHeader(ctx);
    this.drawTemplateTracks(ctx, tracks);
    this.drawTemplateFooter(ctx, canvas.height);

    const link = document.createElement('a');
    link.download = 'wrappify-top-10-semana.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  private drawTemplateBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    const background = ctx.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, '#08110c');
    background.addColorStop(0.42, '#141118');
    background.addColorStop(0.76, '#101820');
    background.addColorStop(1, '#07080b');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(110, 120, 20, 110, 120, 760);
    glow.addColorStop(0, 'rgba(30, 215, 96, 0.42)');
    glow.addColorStop(1, 'rgba(30, 215, 96, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    const pinkGlow = ctx.createRadialGradient(900, 1320, 20, 900, 1320, 640);
    pinkGlow.addColorStop(0, 'rgba(255, 79, 163, 0.22)');
    pinkGlow.addColorStop(1, 'rgba(255, 79, 163, 0)');
    ctx.fillStyle = pinkGlow;
    ctx.fillRect(0, 0, width, height);

    const blueGlow = ctx.createRadialGradient(160, 1780, 20, 160, 1780, 520);
    blueGlow.addColorStop(0, 'rgba(66, 211, 255, 0.16)');
    blueGlow.addColorStop(1, 'rgba(66, 211, 255, 0)');
    ctx.fillStyle = blueGlow;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(820, 112);
    ctx.rotate(-0.17);
    this.roundRect(ctx, 0, 0, 230, 80, 40);
    ctx.fillStyle = 'rgba(30, 215, 96, 0.88)';
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(-40, 420);
    ctx.rotate(0.2);
    this.roundRect(ctx, 0, 0, 190, 56, 28);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fill();
    ctx.restore();
  }

  private drawTemplateHeader(ctx: CanvasRenderingContext2D) {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
    ctx.font = '800 31px Arial, sans-serif';
    ctx.fillText('Esta semana sonaron fuerte', 72, 190);

    ctx.fillStyle = '#f7f8fa';
    ctx.font = '900 92px Arial, sans-serif';
    ctx.fillText('Mis top', 72, 300);
    ctx.fillText('10 tracks', 72, 400);

    ctx.fillStyle = '#1ed760';
    ctx.font = '900 42px Arial, sans-serif';
    ctx.fillText('de la semana', 72, 470);

    this.roundRect(ctx, 72, 520, 344, 54, 27);
    ctx.fillStyle = 'rgba(30, 215, 96, 0.16)';
    ctx.fill();
    ctx.fillStyle = '#dfffe9';
    ctx.font = '900 24px Arial, sans-serif';
    ctx.fillText('TOP PERSONAL', 98, 556);
  }

  private drawTemplateTracks(ctx: CanvasRenderingContext2D, tracks: any[]) {
    tracks.forEach((track, index) => {
      const y = index === 0 ? 635 : 855 + (index - 1) * 92;
      const isFirst = index === 0;
      const rowX = isFirst ? 72 : 94;
      const rowWidth = isFirst ? 936 : 892;
      const rowHeight = isFirst ? 150 : 74;
      const rowRadius = isFirst ? 34 : 22;

      this.roundRect(ctx, rowX, y, rowWidth, rowHeight, rowRadius);
      ctx.fillStyle = isFirst
        ? 'rgba(30, 215, 96, 0.22)'
        : 'rgba(255, 255, 255, 0.08)';
      ctx.fill();
      ctx.strokeStyle = isFirst
        ? 'rgba(30, 215, 96, 0.48)'
        : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (isFirst) {
        ctx.fillStyle = '#f7f8fa';
        ctx.font = '900 74px Arial, sans-serif';
        ctx.fillText('1', rowX + 74, y + 83);
      } else {
        ctx.beginPath();
        ctx.arc(rowX + 38, y + 37, 24, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(30, 215, 96, 0.16)';
        ctx.fill();

        ctx.fillStyle = '#1ed760';
        ctx.font = '900 25px Arial, sans-serif';
        ctx.fillText(String(index + 1), rowX + 38, y + 38);
      }

      const trackName = this.fitText(
        ctx,
        track.name || 'Track sin nombre',
        isFirst ? 690 : 620
      );
      const artistName = this.fitText(
        ctx,
        track.artists?.map((artist: any) => artist.name).join(', ') ||
          track.artists?.[0]?.name ||
          'Artista desconocido',
        isFirst ? 640 : 520
      );

      ctx.textAlign = 'left';
      ctx.fillStyle = '#f7f8fa';
      ctx.font = isFirst
        ? '900 42px Arial, sans-serif'
        : '900 27px Arial, sans-serif';
      ctx.fillText(trackName, isFirst ? rowX + 150 : rowX + 82, isFirst ? y + 65 : y + 32);

      ctx.fillStyle = '#aeb6c2';
      ctx.font = isFirst
        ? '800 29px Arial, sans-serif'
        : '700 21px Arial, sans-serif';
      ctx.fillText(artistName, isFirst ? rowX + 150 : rowX + 82, isFirst ? y + 108 : y + 57);
    });
  }

  private drawTemplateFooter(ctx: CanvasRenderingContext2D, height: number) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.font = '800 24px Arial, sans-serif';
    ctx.fillText('made with', 540, height - 118);

    ctx.fillStyle = '#1ed760';
    ctx.font = '900 40px Arial, sans-serif';
    ctx.fillText('Wrappify', 540, height - 70);
  }

  private fitText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string {
    if (ctx.measureText(text).width <= maxWidth) {
      return text;
    }

    let fittedText = text;
    while (
      fittedText.length > 0 &&
      ctx.measureText(`${fittedText}...`).width > maxWidth
    ) {
      fittedText = fittedText.slice(0, -1);
    }

    return `${fittedText.trim()}...`;
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}
