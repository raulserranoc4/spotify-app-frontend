import { Component, Input } from '@angular/core';
import { Chart, ChartOptions, Plugin, registerables } from 'chart.js';
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
    return this.rawData.map(d => this.getShortMonth(d.trackMonth));
  }

  get doughnutChartData() {
    return [{
      data: this.rawData.map(d => d.time),
      label: 'Minutos escuchados',
      backgroundColor: [
        '#1ed760',
        '#7aa7ff',
        '#f2c94c',
        '#f26d6d',
        '#9b8cff',
        '#45d6c8',
        '#f2994a',
        '#66bb6a',
        '#56ccf2',
        '#eb5757',
        '#bb6bd9',
        '#b7d74b',
      ],
      borderColor: '#0f1115',
      borderWidth: 3,
      hoverOffset: 8,
    }];
  }

  doughnutChartType: 'doughnut' = 'doughnut';

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '66%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#171a21',
        borderColor: 'rgba(255, 255, 255, 0.14)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed} min`,
        },
      },
    },
  };

  doughnutChartPlugins: Plugin<'doughnut'>[] = [
    {
      id: 'monthLabels',
      afterDatasetsDraw: (chart) => {
        const { ctx } = chart;
        const dataset = chart.data.datasets[0];
        const meta = chart.getDatasetMeta(0);

        ctx.save();
        ctx.fillStyle = '#f7f8fa';
        ctx.font = '700 12px Roboto, Helvetica, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        meta.data.forEach((element, index) => {
          const value = dataset.data[index];

          if (!value) {
            return;
          }

          const position = element.tooltipPosition(true);
          if (position.x === null || position.y === null) {
            return;
          }

          ctx.fillText(String(chart.data.labels?.[index] ?? ''), position.x, position.y);
        });

        ctx.restore();
      },
    },
  ];

  private getShortMonth(month: string) {
    const normalizedMonth = month.toLowerCase();
    const monthMap: Record<string, string> = {
      enero: 'Ene',
      febrero: 'Feb',
      marzo: 'Mar',
      abril: 'Abr',
      mayo: 'May',
      junio: 'Jun',
      julio: 'Jul',
      agosto: 'Ago',
      septiembre: 'Sep',
      octubre: 'Oct',
      noviembre: 'Nov',
      diciembre: 'Dic',
    };

    return monthMap[normalizedMonth] || month.slice(0, 3);
  }
}
