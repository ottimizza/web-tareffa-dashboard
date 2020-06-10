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
        color: '#ffffff',
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
    layout: {
      padding: {
        right: 10
      }
    },
    title: {
      display: false
    },
    legend: {
      display: false
    },
    responsive: screen.width < 769 ? true : false
  };

  @Input() barChartLabels: Label[] = [];
  @Input() barChartLegend = false;
  @Input() barChartPlugins = [pluginDataLabels];
  @Input() chartType: 'horizontalBar' | 'bar' = 'horizontalBar';
  @Input() width = '';

  @Input() barChartData: ChartDataSets[] = [{ data: [], label: '' }];

  barChartColors = [{ backgroundColor: '#4b4279' }];
  constructor() {}

  ngOnInit() {}

  getScreenSize(): number {
    return screen.width < 769 ? 100 : 75;
  }
}
