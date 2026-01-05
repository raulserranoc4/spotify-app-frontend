import { Component, Input } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';


Chart.register(...registerables); // ✅ registrar todo

@Component({
  selector: 'app-histogram',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss']
})
export class HistogramComponent {
  @Input() rawData: { trackYear: string; time: number }[] = [];

  get barChartLabels() {
    return this.rawData.map(d => d.trackYear);
  }

  get barChartData() {
  return [{
    data: this.rawData.map(d => d.time),
    label: 'Minutos Escuchados',
    backgroundColor: ['#1db954', '#1ed760', '#169c46', '#0f5f2d'],
    maxBarThickness: 50,
    categoryPercentage: 0.7,
    barPercentage: 0.8
  }];
}

  barChartType: ChartType = 'bar';

  barChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
}
