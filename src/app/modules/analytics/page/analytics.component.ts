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
    this._filterService.requestIndicators().subscribe((a: any) => {
      this.selects = this.selects.concat(
        SideFilterConversorUtils.parse(a.records, 'Indicadores', 'indicators')
      );
    });
    this._filterService.requestCategorias().subscribe((a: any) => {
      this.selects = this.selects.concat(
        SideFilterConversorUtils.parse(a.records, 'Categorias', 'categories')
      );
    });
    this._filterService.requestDepartments().subscribe((a: any) => {
      this.selects = this.selects.concat(
        SideFilterConversorUtils.parse(a.records, 'Departamentos', 'departments', true)
      );
    });
  }
}
