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
  @Input() plugins: PluginServiceGlobalRegistrationAndOptions;

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
