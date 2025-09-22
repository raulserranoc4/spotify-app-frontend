import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'; // Conectar con el backend

  constructor(private http: HttpClient) {}

  public getMessage(): Observable<{ text: string }> {
    return this.http.get<{ text: string }>(`${this.apiUrl}/message`);
  }

  private spotifyApiUrl = 'http://localhost:3000/spotify';

  public getProfile() {
    const token = localStorage.getItem('spotify_token');
    return this.http.get<{ url: string }>(`${this.spotifyApiUrl}/profile`, {
      headers: new HttpHeaders({ Authorization: `${token}` }),
    });
  }

  public getPlaylists() {
    const token = localStorage.getItem('spotify_token');
    return this.http.get(`${this.spotifyApiUrl}/playlists`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }

  public searchArtists(query: string): Observable<any[]> {
    const token = localStorage.getItem('spotify_token');
    return this.http.get<any[]>(`${this.spotifyApiUrl}/search?query=${query}`);
  }

  public getFirstTrackByArtist(artistId: string): Observable<any> {
    const token = localStorage.getItem('spotify_token');
    return this.http.get<any>(`${this.spotifyApiUrl}/first-track/${artistId}`, {
      headers: new HttpHeaders({ Authorization: `${token}` }),
    });
  }

  // Obtener las canciones más escuchadas en la última semana
  public getTopTracksLastWeek(): Observable<any> {
    const token = localStorage.getItem('spotify_token');
    return this.http.get<any>(
      `${this.spotifyApiUrl}/top-tracks?time_range=short_term&limit=10`,
      {
        headers: new HttpHeaders({ Authorization: `${token}` }),
      }
    );
  }

  // Obtener las canciones más escuchadas en el último mes
  public getTopTracksLastMonth(): Observable<any> {
    const token = localStorage.getItem('spotify_token');
    return this.http.get<any>(
      `${this.spotifyApiUrl}/top-tracks?time_range=medium_term&limit=10`,
      {
        headers: new HttpHeaders({ Authorization: `${token}` }),
      }
    );
  }

  public sendFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.spotifyApiUrl}/upload`, formData);
  }
}
