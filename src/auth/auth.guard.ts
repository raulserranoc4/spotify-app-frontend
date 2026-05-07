import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from '../app/services/api.service';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from '../app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private readonly apiService: ApiService,
    private readonly authService: AuthService
  ) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('spotify_token');
    console.log('holaToken: ', token);

    if (!token) {
      if (this.authService.isGuestMode()) {
        this.router.navigate(['/historial']);
        return of(false);
      }

      this.router.navigate(['/login']);
      return of(false); // devuelve un observable que emite "false"
    }

    return this.apiService.getProfile().pipe(
      map((profile) => {
        console.log('Perfil obtenido:', profile);
        return true; // si se obtiene el perfil, permite el acceso
      }),
      catchError((err) => {
        console.error('Error obteniendo perfil:', err);
        this.router.navigate(['/login']);
        return of(false); // en caso de error, bloquea y redirige
      })
    );
  }
}
