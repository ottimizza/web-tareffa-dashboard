import { Component } from '@angular/core';

interface comunicationData {
  newerComunications: number;
  internalMessages: number;
  sendMessages: number;
  receivedMessages: number;
  nonReadMessagesByAccounting: number;
  nonReadMessagesByClient: number;
}

@Component({
  templateUrl: './communications.component.html',
  styleUrls: ['./communications.component.scss']
})
export class CommunicationsComponent {
  // Doughnut Chart
  abertoAtrasado = 123;
  encerradoAtrasado = 76;
  abertoNoPrazo = 374;
  encerradoNoPrazo = 348;

  aberto = this.abertoNoPrazo + this.abertoAtrasado;
  encerrado = this.encerradoAtrasado + this.encerradoNoPrazo;

  chartColors = ['#4b4279', 'lightgray'];

  // Bar Chart

  barChartLabels = ['Fiscal', 'Contábil', 'Administração', 'Depto Humanos', 'Diretoria'];
  barChartData = [
    { data: 200, label: 'Fiscal' },
    { data: 157, label: 'Contábil' },
    { data: 157, label: 'Administração' },
    { data: 98, label: 'Depto Humanos' },
    { data: 32, label: 'Diretoria' }
  ];

  constructor() {}

  getData(data: number[]) {
    return this.abertoAtrasado +
      this.encerradoAtrasado +
      this.abertoNoPrazo +
      this.encerradoNoPrazo >
      0
      ? data
      : [0, -1];
  }

  floor(num: number) {
    if (num.toString() === 'NaN') {
      return '0,0';
    }
    return num.toFixed(1).replace(/\./g, ',') || '0,0';
  }
}
