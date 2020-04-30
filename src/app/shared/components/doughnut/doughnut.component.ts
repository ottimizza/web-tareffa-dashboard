import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

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

  @Input() options: ChartOptions = {
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
    responsive: true
  };

  chartColors = [];

  ngOnInit(): void {
    this.options.title.text = this.title ?? '';
    this.data.forEach(() => {
      this.chartColors.push({ backgroundColor: this.colors });
    });
  }
}
