import { Component, OnInit } from '@angular/core';
import { Label } from 'ng2-charts';
import { FilterService } from '@app/services/filter.service';
import { SelectableFilter } from '@shared/models/Filter';
import { SideFilterConversorUtils } from '@shared/components/side-filter/utils/side-filter-conversor.utils';
import { IndicatorService } from '@app/services/indicator.service';

@Component({
  templateUrl: './standart.component.html',
  styleUrls: ['./standart.component.scss']
})
export class StandartComponent implements OnInit {
  selects: SelectableFilter[] = [];

  chartLabels: Label[] = ['No Praso', 'Atrasados'];
  chartColors = ['#4b4279', 'lightgray'];
  openData = [[Math.round(Math.random() * 2000), Math.round(Math.random() * 2000)]];
  closedData = [[Math.round(Math.random() * 2000), Math.round(Math.random() * 2000)]];

  filters: any;

  constructor(private _filterService: FilterService, private _indicatorService: IndicatorService) {}

  ngOnInit(): void {
    this._filterService
      .requestCategorias()
      .subscribe(subs => this._parse(subs, 'Categorias', 'categories'));
    this._filterService
      .requestDepartments()
      .subscribe(subs => this._parse(subs, 'Departamentos', 'departments', true));
    this._filterService
      .requestIndicators()
      .subscribe(subs => this._parse(subs, 'Unidades de negócio', 'indicators'));
  }

  private _parse(subscriptions: any, title: string, id: string, multiple?: boolean) {
    this.selects.push(SideFilterConversorUtils.parse(subscriptions.records, title, id, multiple));
  }

  fetch() {
    this._indicatorService.getServicoProgramado(this.filters).subscribe((results: any) => {
      console.log(results);
      this.openData = [[results.records[0].abertoNoPrazo, results.records[0].abertoAtrasado]];
      this.closedData = [
        [results.records[0].encerradoNoPrazo, results.records[0].encerradoAtrasado]
      ];
    });
  }
}
