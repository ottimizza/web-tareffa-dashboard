import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { MultiDataSet, Label, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.scss']
})
export class DoughnutComponent implements OnInit {
  @Input() data: MultiDataSet;
  @Input() labels: Label[];
  @Input() colors: string[];
  @Input() title: string;
  @Input() chartTooltip: boolean;
  @Input() fontSize = '60px';
  @Input() plugins: PluginServiceGlobalRegistrationAndOptions[] = [
    {
      beforeDraw: (chart: any) => {
        const ctx = chart.ctx;

        // DADOS DO GRÁFICO
        const data = chart.config.data.datasets[0].data;

        // REGRA DE 3 PRA DESCOBRIR A PORCENTAGEM DE ENCERRADOS
        const txt = `${Math.round((data[0] * 100) / data.reduce((a, b) => a + b, 0))}%`;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

        ctx.font = `${this.fontSize} Montserrat,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif`;
        ctx.fillStyle = '#4b4279';

        // Draw text in center
        ctx.fillText(txt, centerX, centerY);
      }
    }
  ];

  @Input() options: ChartOptions = {
    plugins: {
      datalabels: {
        display: false,
        labels: {
          color: {
            color: 'white'
          }
        }
      }
    },
    title: {
      display: true,
      fontColor: '#d9587f',
      position: 'bottom'
    },
    cutoutPercentage: 85,
    legend: {
      display: false,
      position: 'bottom'
    },
    responsive: false,
    tooltips: {
      enabled: this.chartTooltip ?? true
    }
  };

  chartColors = [];

  hover() {
    this.options.tooltips.enabled = this.chartTooltip ?? true;
  }

  ngOnInit(): void {
    this.options.title.text = this.title ?? '';
    this.data.forEach(() => {
      this.chartColors.push({ backgroundColor: this.colors });
    });
  }
}
