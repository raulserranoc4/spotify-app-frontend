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
}
