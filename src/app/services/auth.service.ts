import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private tokenKey = 'spotify_auth';

  private apiUrl = 'http://localhost:3000/auth';

  public getLoginUrl() {
    return this.http.get<{ url: string }>(`${this.apiUrl}/login`);
  }

  // Guardar el token en LocalStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Obtener el token del LocalStorage
  getToken(): string | null {
    console.log('hola', localStorage.getItem(this.tokenKey));
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
}
