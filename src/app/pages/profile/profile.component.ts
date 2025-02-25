import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  public userProfile: any;

  ngOnInit(): void {
    this.apiService.getProfile().subscribe(
      (data) => {
        this.userProfile = data;
        const userImage =
          this.userProfile.images?.[1]?.url ||
          'https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg';
        this.authService.setUserImage(userImage);

        console.log('hola', this.userProfile);
      },
      (error) => this.handleError(error)
    );
  }

  private handleError(error: any) {
    if (error.status === 401) {
      this.authService.logout();
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    } else {
      console.error('Error obteniendo perfil', error);
    }
  }
}
