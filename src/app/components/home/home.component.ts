import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  message = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['access_token'];
      if (token) {
        this.authService.setToken(token);
        this.router.navigate(['/dashboard']); // Redirigir a la página principal
      } else {
        console.error('No se recibió token');
        this.router.navigate(['/']); // Redirigir al inicio si falla
      }
    });
  }
}
