import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss',
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];

      console.log('has llegado al callback', code);

      if (code) {
        this.authService.callback(code).subscribe(
          (response) => {
            this.authService.clearGuestMode();
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
