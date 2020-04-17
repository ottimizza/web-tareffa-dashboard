import { Component } from '@angular/core';
import { Label, MultiDataSet } from 'ng2-charts';

@Component({
  templateUrl: './standart.component.html',
  styleUrls: ['./standart.component.scss']
})
export class StandartComponent {
  chartLabels: Label[] = ['No Praso', 'Atrasados'];
  chartColors = ['#00acc1', '#e53935'];

  openData = [
    [Math.round(Math.random() * 2000), Math.round(Math.random() * 2000)],
    [Math.round(Math.random() * 2000), Math.round(Math.random() * 2000)],
    [Math.round(Math.random() * 2000), Math.round(Math.random() * 2000)],
    [Math.round(Math.random() * 2000), Math.round(Math.random() * 2000)],
    [Math.round(Math.random() * 2000), Math.round(Math.random() * 2000)]
  ];
  closedData = [
    [Math.round(Math.random() * 2000), Math.round(Math.random() * 2000)],
    [Math.round(Math.random() * 2000), Math.round(Math.random() * 2000)],
    [Math.round(Math.random() * 2000), Math.round(Math.random() * 2000)],
    [Math.round(Math.random() * 2000), Math.round(Math.random() * 2000)],
    [Math.round(Math.random() * 2000), Math.round(Math.random() * 2000)]
  ];
}
