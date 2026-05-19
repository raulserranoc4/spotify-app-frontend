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
  @Input() groupMonthlyLabels = false;

  private readonly chartColors = ['#1ed760', '#7aa7ff', '#f2c94c', '#f26d6d', '#9b8cff'];
  private readonly monthLabels = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];

  get barChartLabels() {
    if (this.isMonthlyChart) {
      return this.rawData.map((d) => this.formatMonthLabel(this.getRawLabel(d)));
    }

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
      maxBarThickness: this.isMonthlyChart ? 26 : this.rawData.length > 14 ? 30 : 50,
      minBarLength: this.isMonthlyChart ? 8 : 0,
      categoryPercentage: this.isMonthlyChart ? 0.78 : this.rawData.length > 14 ? 0.82 : 0.7,
      barPercentage: this.isMonthlyChart ? 0.86 : this.rawData.length > 14 ? 0.9 : 0.8
    }];
  }

  get chartWidth() {
    if (this.isMonthlyChart) {
      return 640;
    }

    return Math.max(640, this.rawData.length * 54);
  }

  get chartHeight() {
    return this.isMonthlyChart ? Math.max(420, this.rawData.length * 44) : 360;
  }

  get chartStyleWidth() {
    return this.isMonthlyChart ? '100%' : `${this.chartWidth}px`;
  }

  get isMonthlyChart(): boolean {
    return this.groupMonthlyLabels && this.hasMonthlyLabels;
  }

  barChartType: 'bar' = 'bar';

  get barChartOptions(): ChartOptions<'bar'> {
    return {
      indexAxis: this.isMonthlyChart ? 'y' : 'x',
      responsive: this.isMonthlyChart,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: !this.isMonthlyChart,
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
            label: (context) =>
              `${this.isMonthlyChart ? context.parsed.x : context.parsed.y} min`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: this.isMonthlyChart,
          grid: {
            color: this.isMonthlyChart
              ? 'rgba(255, 255, 255, 0.08)'
              : 'transparent',
          },
          ticks: {
            color: '#aeb6c2',
            autoSkip: !this.isMonthlyChart,
            padding: this.isMonthlyChart ? 3 : 3,
            font: {
              size: this.isMonthlyChart ? 12 : 12,
              weight: 'normal',
            },
            maxRotation: this.rawData.length > 8 && !this.isMonthlyChart ? 55 : 0,
            minRotation: this.rawData.length > 8 && !this.isMonthlyChart ? 55 : 0,
          },
        },
        y: {
          beginAtZero: !this.isMonthlyChart,
          grid: {
            color: this.isMonthlyChart
              ? 'transparent'
              : 'rgba(255, 255, 255, 0.08)',
          },
          ticks: {
            color: '#aeb6c2',
            font: {
              size: this.isMonthlyChart ? 13 : 12,
              weight: this.isMonthlyChart ? 'bold' : 'normal',
            },
          },
        }
      }
    };
  }

  get hasMonthlyLabels(): boolean {
    return this.rawData.some((d) => /^\d{4}-\d{2}$/.test(this.getRawLabel(d)));
  }

  private getRawLabel(datum: HistogramDatum): string {
    return (
      datum.label ??
      datum.trackMonthYear ??
      datum.monthYear ??
      datum.trackYear ??
      datum.trackMonth ??
      ''
    );
  }

  private formatMonthLabel(label: string): string {
    const match = label.match(/^(\d{4})-(\d{2})$/);

    if (!match) {
      return label;
    }

    const monthIndex = Number(match[2]) - 1;
    const month = this.monthLabels[monthIndex] ?? match[2];
    return `${month} ${match[1]}`;
  }
}
