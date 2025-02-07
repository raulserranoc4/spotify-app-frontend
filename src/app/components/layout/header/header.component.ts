import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatGridListModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('spotify_token');

    window.open(
      'https://accounts.spotify.com/logout',
      '_blank',
      'width=500,height=500'
    );

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }
}
