import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3001'; // Conectar con el backend

  constructor(private http: HttpClient) {}

  public getMessage(): Observable<{ text: string }> {
    return this.http.get<{ text: string }>(`${this.apiUrl}/message`);
  }

  private spotifyApiUrl = 'http://localhost:3001/spotify';

  private getToken(): string | null {
    return localStorage.getItem('spotify_access_token');
  }

  public getProfile(token: string) {
    return this.http.get(`${this.spotifyApiUrl}/profile`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }

  public getPlaylists(token: string) {
    return this.http.get(`${this.spotifyApiUrl}/playlists`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }
}
