import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.sass']
})
export class LineComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{}],
      yAxes: [{}]
    }
  };
  public barChartLabels: Label[] = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Abr',
    'Mai',
    'Jun',
    'Abr',
    'Mai',
    'Jun'
  ];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [];

  @Input() data: number;

  data1 = [
    {
      data: [25, 2, 13, 25, 55, 74, 25, 55, 74, 25, 55, 74],
      label: 'Aberto no prazo',
      stack: 'a'
    },
    {
      data: [5, 37, 8, 25, 17, 20, 25, 55, 74, 25, 55, 74],
      label: 'Aberto atrasado',
      stack: 'a'
    },
    {
      data: [55, 25, 25, 25, 20, 5, 25, 55, 74, 25, 55, 74],
      label: 'Fechado no prazo',
      stack: 'a'
    },
    {
      data: [15, 88, 1, 25, 33, 1, 25, 55, 74, 25, 55, 74],
      label: 'Fechado atrasado',
      stack: 'a'
    },
    {
      data: [15, 88, 1, 25, 33, 1, 25, 55, 74, 25, 55, 74],
      label: 'Fechado atrasado',
      stack: 'a'
    },
    {
      data: [15, 88, 1, 25, 33, 1, 25, 55, 74, 25, 55, 74],
      label: 'Fechado atrasado',
      stack: 'a'
    }
  ];

  data2 = [
    {
      data: [25, 2, 13, 25, 55, 74, 25, 55, 74, 25, 55, 74],
      label: 'Empresa A',
      stack: 'a'
    },
    {
      data: [5, 37, 8, 25, 17, 20, 25, 55, 74, 25, 55, 74],
      label: 'Empresa B',
      stack: 'a'
    },
    {
      data: [55, 25, 25, 25, 20, 5, 25, 55, 74, 25, 55, 74],
      label: 'Empresa C',
      stack: 'a'
    },
    {
      data: [15, 88, 1, 25, 33, 1, 25, 55, 74, 25, 55, 74],
      label: 'Empresa D',
      stack: 'a'
    },
    {
      data: [15, 88, 1, 25, 33, 1, 25, 55, 74, 25, 55, 74],
      label: 'Fechado atrasado',
      stack: 'a'
    }
  ];

  data3 = [
    {
      data: [25, 2, 13, 25, 55, 74, 25, 55, 74, 25, 55, 74],
      label: 'Departamento no prazo',
      stack: 'a'
    },
    {
      data: [5, 37, 8, 25, 17, 20, 25, 55, 74, 25, 55, 74],
      label: 'Departamento atrasado',
      stack: 'a'
    },
    {
      data: [55, 25, 25, 25, 20, 5, 25, 55, 74, 25, 55, 74],
      label: 'Departamento no prazo',
      stack: 'a'
    },
    {
      data: [15, 88, 1, 25, 33, 1, 25, 55, 74, 25, 55, 74],
      label: 'Departamento atrasado',
      stack: 'a'
    },
    {
      data: [15, 88, 1, 25, 33, 1, 25, 55, 74, 25, 55, 74],
      label: 'Fechado atrasado',
      stack: 'a'
    }
  ];

  barChartColors = [
    { backgroundColor: 'rgba(75, 66, 121, .8)' },
    { backgroundColor: 'rgba(217, 88, 127, .8)' },
    { backgroundColor: 'rgba(75, 66, 121, .8)' },
    { backgroundColor: 'rgba(217, 88, 127, .8)' }
  ];

  constructor() {}

  ngOnInit() {
    if (this.data === 1) {
      this.barChartData = this.data1;
    } else if (this.data === 2) {
      this.barChartData = this.data2;
    } else if (this.data === 3) {
      this.barChartData = this.data3;
    }
  }
}
