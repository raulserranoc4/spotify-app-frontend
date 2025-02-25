import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent {
  constructor(private apiService: ApiService) {}

  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile() {
    if (!this.selectedFile) {
      alert('Selecciona un archivo antes de subir.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.apiService.sendFile(formData).subscribe({
      next: (response) => console.log('Archivo subido con éxito', response),
      error: (error: HttpErrorResponse) =>
        console.error('Error al subir el archivo', error),
    });
  }
}
