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
  imports: [CommonModule, LoadingComponent, MatCardModule, MatListModule, HistogramComponent, DoughnutComponent, FormsModule, MatSelectModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent {
  constructor(private apiService: ApiService) {}

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
      this.selectedFile = input.files[0];
    }
  }

  public uploadFile() {
    if (!this.selectedFile) {
      this.showError('Selecciona un archivo ZIP antes de analizar tu historial.');
      return;
    }

    this.recordInfo = null;

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.apiService.sendFile(formData).subscribe({
      next: (response: RecordInfoDto) => {
        console.log('Archivo subido con éxito', response);
        this.recordInfo = response;
        this.artists = response.artists.slice(1);
        this.tracks = response.tracks.slice(1);
        this.firstArtist = this.toDisplayArtist(response.artists[0]);
        this.firstTrack = this.toDisplayTrack(response.tracks[0]);
        this.histogramYearsData = response.yearsInfo;
        this.doughnutMonthData = response.monthsInfo;
        this.totalArtists = response.totalArtists;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al subir el archivo', error);
        this.isSelectFilePage = true;
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
}
