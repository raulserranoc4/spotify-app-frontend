import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-callback',
  standalone: true,
  template: `<p>Autenticando...</p>`,
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];

      console.log('has llegado al callback', code);

      if (code) {
        // Enviar el código al backend para intercambiarlo por un token de acceso
        this.http
          .get<{ access_token: string }>(
            `http://localhost:3000/auth/callback?code=${code}`
          )
          .subscribe(
            (response) => {
              localStorage.setItem('spotify_token', response.access_token); // Guardar token
              this.router.navigate(['/home']); // Redirigir a Home
            },
            (error) => {
              console.error('Error en la autenticación:', error);
              this.router.navigate(['/login']);
            }
          );
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
