import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ArtistSearchComponent } from '../artist-search/artist-search.component';
import { ProfileComponent } from '../profile/profile.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FileUploaderComponent } from '../file-uploader/file-uploader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ArtistSearchComponent,
    ProfileComponent,
    MatTabsModule,
    FileUploaderComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
