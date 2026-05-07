import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatCardModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  loginWithSpotify() {
    this.authService.getLoginUrl().subscribe((response) => {
      console.log('hayURL',response.url);
      window.location.href = response.url;
    });
  }

  enterAsGuest() {
    this.authService.enterAsGuest();
    this.router.navigate(['/historial']);
  }
}
