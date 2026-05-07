import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent implements OnInit, OnDestroy {
  public loadingMessages: string[] = [
    'Leyendo tu historial de reproduccion',
    'Ordenando tus canciones mas escuchadas',
    'Calculando minutos por artista',
    'Buscando patrones entre tus escuchas',
    'Preparando tus graficos musicales',
    'Afinando el resumen de Wrappify',
  ];

  public currentMessage = this.loadingMessages[0];
  private messageIndex = 0;
  private messageInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.messageInterval = setInterval(() => {
      this.messageIndex = (this.messageIndex + 1) % this.loadingMessages.length;
      this.currentMessage = this.loadingMessages[this.messageIndex];
    }, 2600);
  }

  ngOnDestroy() {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
    }
  }
}
