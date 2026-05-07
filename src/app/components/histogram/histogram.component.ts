import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Chart, ChartOptions, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(...registerables);

interface HistogramDatum {
  time: number;
  label?: string;
  trackYear?: string;
  trackMonth?: string;
  monthYear?: string;
  trackMonthYear?: string;
}

@Component({
  selector: 'app-histogram',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss']
})
export class HistogramComponent {
  @Input() rawData: HistogramDatum[] = [];

  private readonly chartColors = ['#1ed760', '#7aa7ff', '#f2c94c', '#f26d6d', '#9b8cff'];

  get barChartLabels() {
    return this.rawData.map((d) => (
      d.label ??
      d.trackMonthYear ??
      d.monthYear ??
      d.trackYear ??
      d.trackMonth ??
      ''
    ));
  }

  get barChartData() {
    return [{
      data: this.rawData.map(d => d.time),
      label: 'Minutos escuchados',
      backgroundColor: this.rawData.map((_, index) => this.chartColors[index % this.chartColors.length]),
      borderColor: '#0f1115',
      borderWidth: 2,
      borderRadius: 8,
      maxBarThickness: this.rawData.length > 14 ? 30 : 50,
      categoryPercentage: this.rawData.length > 14 ? 0.82 : 0.7,
      barPercentage: this.rawData.length > 14 ? 0.9 : 0.8
    }];
  }

  get chartWidth() {
    return Math.max(640, this.rawData.length * 54);
  }

  barChartType: 'bar' = 'bar';

  get barChartOptions(): ChartOptions<'bar'> {
    return {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#dfe6ee',
            boxWidth: 14,
            boxHeight: 14,
            useBorderRadius: true,
          },
        },
        tooltip: {
          backgroundColor: '#171a21',
          borderColor: 'rgba(255, 255, 255, 0.14)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.parsed.y} min`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#aeb6c2',
            autoSkip: false,
            maxRotation: this.rawData.length > 8 ? 55 : 0,
            minRotation: this.rawData.length > 8 ? 55 : 0,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.08)',
          },
          ticks: {
            color: '#aeb6c2',
          },
        }
      }
    };
  }
}
