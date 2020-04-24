import { Component, OnInit } from '@angular/core';
import { Label } from 'ng2-charts';
import { FilterService } from '@app/services/filter.service';
import { SelectableFilter } from '@shared/models/Filter';
import { SideFilterConversorUtils } from '@shared/components/side-filter/utils/side-filter-conversor.utils';

@Component({
  templateUrl: './standart.component.html',
  styleUrls: ['./standart.component.scss']
})
export class StandartComponent implements OnInit {
  selects: SelectableFilter[] = [];

  chartLabels: Label[] = ['No Praso', 'Atrasados'];
  chartColors = ['#00acc1', '#e53935'];
  openData = [[Math.round(Math.random() * 2000), Math.round(Math.random() * 2000)]];
  closedData = [[Math.round(Math.random() * 2000), Math.round(Math.random() * 2000)]];

  constructor(private _filterService: FilterService) {}

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
}
