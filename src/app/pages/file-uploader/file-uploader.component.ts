import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingComponent } from '../../components/loading/loading.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { HistogramComponent } from '../../components/histogram/histogram.component';
import { DoughnutComponent } from "../../components/doughnut/doughnut.component";
import { FormControl, FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  Artist,
  ArtistAnalysis,
  DisplayRecordArtist,
  DisplayRecordTrack,
  RecordArtist,
  RecordInfoDto,
  RecordTrack,
  TimeDuration,
  TrackMonth,
  TrackYear,
} from './dto/analysis.dto';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule, LoadingComponent, MatCardModule, MatListModule, HistogramComponent, DoughnutComponent, FormsModule, MatSelectModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent {
  constructor(private apiService: ApiService) {}

  private readonly trackFallbackImage = this.createFallbackImage('♪', 'Track');

  public selectedFile: File | null = null;
  public isSelectFilePage: boolean = true;
  public recordInfo: RecordInfoDto | null = null;
  public artists: RecordArtist[] = [];
  public tracks: RecordTrack[] = [];
  public firstArtist!: DisplayRecordArtist;
  public firstTrack!: DisplayRecordTrack;
  public histogramYearsData: TrackYear[] = [];
  public doughnutMonthData: TrackMonth[] = [];
  public selectedArtist: string = "";
  public totalArtists: Artist[] = [];
  public filteredOptions!: Observable<Artist[]>;
  public myControl = new FormControl('');
  public artistAnalysis: ArtistAnalysis | null = null;
  public isLoadingArtist: boolean = false;  
  public errorMessage: string | null = null;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string | null): Artist[] {
    if (!value) {
      return this.totalArtists;
    }
    let i = 0;
    const filterValue = value.toLowerCase();
    return this.totalArtists.filter(option =>
      {try{
        i++
        return option.artistName.toLowerCase().includes(filterValue)
      }catch(e){
        return false;
      }
      
      }
    );
  }

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!this.isZipFile(file)) {
        this.selectedFile = null;
        input.value = '';
        this.showError('El archivo seleccionado debe ser un ZIP de Spotify.');
        return;
      }

      this.selectedFile = file;
      this.clearError();
    }
  }

  public uploadFile() {
    if (!this.selectedFile) {
      this.showError('Selecciona un archivo ZIP antes de analizar tu historial.');
      return;
    }

    if (!this.isZipFile(this.selectedFile)) {
      this.showError('El archivo seleccionado debe ser un ZIP de Spotify.');
      return;
    }

    this.clearError();
    this.recordInfo = null;

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.apiService.sendFile(formData).subscribe({
      next: (response: RecordInfoDto) => {
        console.log('Archivo subido con éxito', response);
        this.recordInfo = response;
        this.artists = response.artists.slice(1, 10);
        this.tracks = response.tracks.slice(1, 10);
        this.firstArtist = this.toDisplayArtist(response.artists[0]);
        this.firstTrack = this.toDisplayTrack(response.tracks[0]);
        this.histogramYearsData = response.yearsInfo;
        this.doughnutMonthData = response.monthsInfo;
        this.totalArtists = response.totalArtists;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al subir el archivo', error);
        this.isSelectFilePage = true;
        this.recordInfo = null;
        this.showError(this.getUploadErrorMessage(error));
      }
    });

    this.isSelectFilePage = false;
  }

  public goToUploadFile() {
    this.isSelectFilePage = true;
    this.clearError();
  }

  public convertSeconds(totalSeconds: number): TimeDuration {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = (totalSeconds % 60).toFixed(0);

    return { hours, minutes, seconds };
  }

  public obtainArtistsImage() {
    if (!this.recordInfo?.artists?.length) {
      this.showError('Analiza primero tu historial para descargar el top de artistas.');
      return;
    }

    this.downloadTopArtistsTemplate(this.recordInfo.artists.slice(0, 10));
  }

  public obtainTracksImage() {
    if (!this.recordInfo?.tracks?.length) {
      this.showError('Analiza primero tu historial para descargar el top de canciones.');
      return;
    }

    this.downloadTopTracksTemplate(this.recordInfo.tracks.slice(0, 10));
  }

  private toDisplayArtist(artist: RecordArtist): DisplayRecordArtist {
    return {
      ...artist,
      time: this.convertSeconds(artist.time),
    };
  }

  private toDisplayTrack(track: RecordTrack): DisplayRecordTrack {
    return {
      ...track,
      time: this.convertSeconds(track.time),
    };
  }

  public getArtistImage(
    artist: RecordArtist | DisplayRecordArtist | null | undefined
  ): string {
    const imageUrl = artist?.images?.find((image) => !!image.url)?.url;

    return imageUrl || this.createFallbackImage(
      this.getInitials(artist?.name || artist?.artistName),
      artist?.name || artist?.artistName || 'Artista'
    );
  }

  public getArtistAnalysisImage(
    artistAnalysis: ArtistAnalysis | null | undefined
  ): string {
    return (
      artistAnalysis?.artistImage ||
      this.createFallbackImage(
        this.getInitials(artistAnalysis?.artistName),
        artistAnalysis?.artistName || 'Artista'
      )
    );
  }

  public getTrackImage(track: RecordTrack | DisplayRecordTrack): string {
    return (
      track.album?.images?.find((image) => !!image.url)?.url ||
      this.trackFallbackImage
    );
  }

  public useArtistFallbackImage(event: Event, artistName?: string) {
    const image = event.target as HTMLImageElement;
    image.src = this.createFallbackImage(
      this.getInitials(artistName),
      artistName || 'Artista'
    );
  }

  public useTrackFallbackImage(event: Event) {
    const image = event.target as HTMLImageElement;
    image.src = this.trackFallbackImage;
  }

  private getInitials(name?: string): string {
    if (!name) {
      return '?';
    }

    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  private createFallbackImage(initials: string, label: string): string {
    const safeInitials = this.escapeSvgText(initials);
    const safeLabel = this.escapeSvgText(label);
    const isTrackFallback = label === 'Track';
    const initialsY = isTrackFallback ? 96 : 118;
    const labelY = isTrackFallback ? 176 : 174;
    const initialsSize = isTrackFallback ? 80 : 74;
    const labelSize = isTrackFallback ? 24 : 20;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
        <defs>
          <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#1ed760"/>
            <stop offset="58%" stop-color="#161b22"/>
            <stop offset="100%" stop-color="#0b0d11"/>
          </linearGradient>
        </defs>
        <rect width="240" height="240" rx="34" fill="url(#bg)"/>
        <circle cx="188" cy="42" r="54" fill="rgba(255,255,255,0.14)"/>
        <circle cx="42" cy="198" r="64" fill="rgba(30,215,96,0.2)"/>
        <text x="120" y="${initialsY}" text-anchor="middle" dominant-baseline="central" fill="#f7f8fa" font-family="Arial, sans-serif" font-size="${initialsSize}" font-weight="900">${safeInitials}</text>
        <text x="120" y="${labelY}" text-anchor="middle" fill="#d8dee6" font-family="Arial, sans-serif" font-size="${labelSize}" font-weight="800">${safeLabel}</text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  private escapeSvgText(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  public analyzeArtist() {

    this.artistAnalysis = null;
    this.isLoadingArtist = true;

    if (!this.selectedFile) {
      this.showError('Selecciona un archivo ZIP antes de analizar un artista.');
      this.isLoadingArtist = false;
      return;
    }

    const artist = this.findArtistByName(this.myControl.value);

    if(!artist.artistName){
      this.showError('No hemos encontrado ese artista en el historial subido.');
      this.isLoadingArtist = false;
      return;
    }

    

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('artist', JSON.stringify(artist));

    try{
      this.apiService.analyzeArtist(formData).subscribe({
        next: (response) => {
          console.log('Artista analizado con éxito', response);
          this.artistAnalysis = response;
          this.isLoadingArtist = false;
        },
        error: (error: HttpErrorResponse) =>
          console.error('Error al analizar el artista', error),
      });
    }catch(e){
      console.error('Error al analizar el artista', e);
      this.isLoadingArtist = false;
    }
  }

  private findArtistByName(name: string | null): Artist {
    const artist: Artist | undefined = this.totalArtists.find(artist => artist.artistName === name);

    if (!artist) {
      return { artistName: "", trackID: "" };
    }
    return artist;
  }

  public clearError() {
    this.errorMessage = null;
  }

  private showError(message: string) {
    this.errorMessage = message;
  }

  private isZipFile(file: File): boolean {
    return (
      file.name.toLowerCase().endsWith('.zip') ||
      file.type === 'application/zip' ||
      file.type === 'application/x-zip-compressed'
    );
  }

  private getUploadErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se ha podido conectar con el servidor. Comprueba que la API esta levantada.';
    }

    if (typeof error.error?.message === 'string') {
      return error.error.message;
    }

    if (typeof error.error === 'string') {
      return error.error;
    }

    return 'No se ha podido analizar el archivo. Comprueba que sea el ZIP correcto de Spotify.';
  }

  private downloadTopArtistsTemplate(artists: RecordArtist[]) {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.drawStoryBackground(ctx, canvas.width, canvas.height);
    this.drawArtistsStoryHeader(ctx);
    this.drawArtistsStoryRanking(ctx, artists);
    this.drawStoryFooter(ctx, canvas.height);

    const link = document.createElement('a');
    link.download = 'wrappify-top-10-artistas.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  private downloadTopTracksTemplate(tracks: RecordTrack[]) {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.drawStoryBackground(ctx, canvas.width, canvas.height);
    this.drawTracksStoryHeader(ctx);
    this.drawTracksStoryRanking(ctx, tracks);
    this.drawStoryFooter(ctx, canvas.height);

    const link = document.createElement('a');
    link.download = 'wrappify-top-10-canciones.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  private drawStoryBackground(
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

    const greenGlow = ctx.createRadialGradient(120, 130, 20, 120, 130, 780);
    greenGlow.addColorStop(0, 'rgba(30, 215, 96, 0.42)');
    greenGlow.addColorStop(1, 'rgba(30, 215, 96, 0)');
    ctx.fillStyle = greenGlow;
    ctx.fillRect(0, 0, width, height);

    const pinkGlow = ctx.createRadialGradient(900, 1260, 20, 900, 1260, 650);
    pinkGlow.addColorStop(0, 'rgba(255, 79, 163, 0.2)');
    pinkGlow.addColorStop(1, 'rgba(255, 79, 163, 0)');
    ctx.fillStyle = pinkGlow;
    ctx.fillRect(0, 0, width, height);

    const blueGlow = ctx.createRadialGradient(160, 1780, 20, 160, 1780, 520);
    blueGlow.addColorStop(0, 'rgba(66, 211, 255, 0.16)');
    blueGlow.addColorStop(1, 'rgba(66, 211, 255, 0)');
    ctx.fillStyle = blueGlow;
    ctx.fillRect(0, 0, width, height);
  }

  private drawArtistsStoryHeader(ctx: CanvasRenderingContext2D) {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
    ctx.font = '800 31px Arial, sans-serif';
    ctx.fillText('Tu historial tuvo claros favoritos', 72, 190);

    ctx.fillStyle = '#f7f8fa';
    ctx.font = '900 92px Arial, sans-serif';
    ctx.fillText('Mis top', 72, 300);
    ctx.fillText('10 artistas', 72, 400);

    ctx.fillStyle = '#1ed760';
    ctx.font = '900 42px Arial, sans-serif';
    ctx.fillText('mas escuchados', 72, 470);

    this.roundRect(ctx, 72, 520, 344, 54, 27);
    ctx.fillStyle = 'rgba(30, 215, 96, 0.16)';
    ctx.fill();
    ctx.fillStyle = '#dfffe9';
    ctx.font = '900 24px Arial, sans-serif';
    ctx.fillText('TOP PERSONAL', 98, 556);
  }

  private drawTracksStoryHeader(ctx: CanvasRenderingContext2D) {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
    ctx.font = '800 31px Arial, sans-serif';
    ctx.fillText('Las canciones que mas repetiste', 72, 190);

    ctx.fillStyle = '#f7f8fa';
    ctx.font = '900 92px Arial, sans-serif';
    ctx.fillText('Mis top', 72, 300);
    ctx.fillText('10 tracks', 72, 400);

    ctx.fillStyle = '#1ed760';
    ctx.font = '900 42px Arial, sans-serif';
    ctx.fillText('mas escuchados', 72, 470);

    this.roundRect(ctx, 72, 520, 344, 54, 27);
    ctx.fillStyle = 'rgba(30, 215, 96, 0.16)';
    ctx.fill();
    ctx.fillStyle = '#dfffe9';
    ctx.font = '900 24px Arial, sans-serif';
    ctx.fillText('TOP PERSONAL', 98, 556);
  }

  private drawArtistsStoryRanking(
    ctx: CanvasRenderingContext2D,
    artists: RecordArtist[]
  ) {
    artists.forEach((artist, index) => {
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

      const artistName = this.fitCanvasText(
        ctx,
        artist.name || artist.artistName || 'Artista desconocido',
        isFirst ? 690 : 620
      );
      const minutes = `${Math.round(artist.time / 60)} min escuchados`;

      ctx.textAlign = 'left';
      ctx.fillStyle = '#f7f8fa';
      ctx.font = isFirst
        ? '900 42px Arial, sans-serif'
        : '900 27px Arial, sans-serif';
      ctx.fillText(
        artistName,
        isFirst ? rowX + 150 : rowX + 82,
        isFirst ? y + 65 : y + 32
      );

      ctx.fillStyle = '#aeb6c2';
      ctx.font = isFirst
        ? '800 29px Arial, sans-serif'
        : '700 21px Arial, sans-serif';
      ctx.fillText(
        minutes,
        isFirst ? rowX + 150 : rowX + 82,
        isFirst ? y + 108 : y + 57
      );
    });
  }

  private drawTracksStoryRanking(
    ctx: CanvasRenderingContext2D,
    tracks: RecordTrack[]
  ) {
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

      const trackName = this.fitCanvasText(
        ctx,
        track.name || track.trackName || 'Cancion desconocida',
        isFirst ? 690 : 620
      );
      const artistName = this.fitCanvasText(
        ctx,
        track.artists?.map((artist) => artist.name).join(', ') ||
          `${Math.round(track.time / 60)} min escuchados`,
        isFirst ? 640 : 520
      );

      ctx.textAlign = 'left';
      ctx.fillStyle = '#f7f8fa';
      ctx.font = isFirst
        ? '900 42px Arial, sans-serif'
        : '900 27px Arial, sans-serif';
      ctx.fillText(
        trackName,
        isFirst ? rowX + 150 : rowX + 82,
        isFirst ? y + 65 : y + 32
      );

      ctx.fillStyle = '#aeb6c2';
      ctx.font = isFirst
        ? '800 29px Arial, sans-serif'
        : '700 21px Arial, sans-serif';
      ctx.fillText(
        artistName,
        isFirst ? rowX + 150 : rowX + 82,
        isFirst ? y + 108 : y + 57
      );
    });
  }

  private drawStoryFooter(ctx: CanvasRenderingContext2D, height: number) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.font = '800 24px Arial, sans-serif';
    ctx.fillText('made with', 540, height - 118);

    ctx.fillStyle = '#1ed760';
    ctx.font = '900 40px Arial, sans-serif';
    ctx.fillText('Wrappify', 540, height - 70);
  }

  private fitCanvasText(
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
