import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('spotify_token');

    if (!token) {
      this.router.navigate(['/login']); // 👈 Si no hay token, redirigir al login
      return false;
    }
    return true;
  }
}
