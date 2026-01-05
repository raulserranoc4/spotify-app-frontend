import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private tokenKey = 'spotify_auth';

  private apiUrl = 'http://localhost:3000/spotify-auth';

  public getLoginUrl() {
    return this.http.get<{ url: string }>(`${this.apiUrl}/login`);
  }

  // Guardar el token en LocalStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Obtener el token del LocalStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Eliminar el token (logout)
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Verificar si hay un token guardado
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  async isTokenValid(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Token inválido');

      return true;
    } catch (error) {
      this.clearToken();
      return false;
    }
  }

  public logout() {
    localStorage.removeItem('spotify_token');

    window.open(
      'https://accounts.spotify.com/logout',
      '_blank',
      'width=500,height=500'
    );
  }

  public callback(code: string): Observable<any> {
    return this.http.get<{ access_token: string }>(
      `${this.apiUrl}/callback?code=${code}`
    );
  }

  private userImageSource = new BehaviorSubject<string | null>(null);
  userImage$ = this.userImageSource.asObservable();

  setUserImage(imageUrl: string) {
    this.userImageSource.next(imageUrl);
  }
}
