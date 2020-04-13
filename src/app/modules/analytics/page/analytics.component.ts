import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FilterService } from '@app/services/filter.service';
import { SelectableFilter } from '@shared/models/Filter';
import { SideFilterConversorUtils } from '@shared/components/side-filter/utils/side-filter-conversor.utils';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsComponent implements OnInit {
  selects: SelectableFilter[] = [];

  constructor(private _filterService: FilterService) {}

  ngOnInit() {
    this._filterService
      .requestIndicators()
      .subscribe(a => this._parse(a, 'Indicadores', 'indicators'));
    this._filterService
      .requestCategorias()
      .subscribe(a => this._parse(a, 'Categorias', 'categories'));
    this._filterService
      .requestDepartments()
      .subscribe(a => this._parse(a, 'Departamentos', 'departments', true));
  }

  private _parse(subscriptions: any, title: string, id: string, multiple?: boolean) {
    this.selects.push(SideFilterConversorUtils.parse(subscriptions.records, title, id, multiple));
  }
}
