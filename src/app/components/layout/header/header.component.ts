import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatGridListModule, MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private router: Router, private authService: AuthService) {}

  public logout() {
    this.authService.logout();

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }

  public userImage: string | null = null;

  ngOnInit() {
    this.authService.userImage$.subscribe((image) => {
      console.log('hola');
      this.userImage = image;
    });
  }
}
