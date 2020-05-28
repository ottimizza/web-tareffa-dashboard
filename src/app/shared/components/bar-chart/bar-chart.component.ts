import { Component, OnInit, Input } from '@angular/core';
import { Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.sass']
})
export class BarChartComponent implements OnInit {
  @Input() barChartOptions: ChartOptions = {
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'left'
      }
    },
    spanGaps: false,
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false
          },
          ticks: {
            display: false
          },
          scaleLabel: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            display: false
          },
          ticks: {
            display: true
          }
        }
      ]
    },
    title: {
      display: false
    },
    legend: {
      display: false
    },
    responsive: false
  };

  @Input() barChartLabels: Label[] = [];
  @Input() barChartLegend = false;
  @Input() barChartPlugins = [pluginDataLabels];

  @Input() barChartData: ChartDataSets[] = [{ data: [], label: '' }];
  constructor() {}

  ngOnInit() {}

  getScreenSize(): number {
    return screen.width < 769 ? 100 : 75;
  }
}
