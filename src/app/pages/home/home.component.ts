import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private apiService: ApiService) {}

  public userProfile: any;

  ngOnInit(): void {
    this.apiService.getProfile().subscribe(
      (data) => (this.userProfile = data),
      (error) => console.error('Error obteniendo perfil', error)
    );
  }
}
