import { Component, Input } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';


Chart.register(...registerables); // ✅ registrar todo

@Component({
  selector: 'app-doughnut',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.scss']
})
export class DoughnutComponent {
  @Input() rawData: { trackMonth: string; time: number }[] = [];

  get doughnutChartLabels() {
    return this.rawData.map(d => d.trackMonth);
  }

  get doughnutChartData() {
    return [{
      data: this.rawData.map(d => d.time),
      label: 'Minutos Escuchados',
      backgroundColor: ['#1db954', '#1ed760', '#169c46', '#0f5f2d'],
      // maxBarThickness: 50,
      // categoryPercentage: 0.7,
      // barPercentage: 0.8
    }];
  }

  doughnutChartType: ChartType = 'doughnut';

  doughnutChartOptions = {
    responsive: true,
    cutout: '70%'
    // plugins: {
    //   legend: {
    //     position: ''
    //   }
    // }
  };
}
