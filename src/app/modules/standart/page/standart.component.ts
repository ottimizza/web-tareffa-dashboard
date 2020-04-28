import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Label } from 'ng2-charts';
import { FilterService } from '@app/services/filter.service';
import { SelectableFilter } from '@shared/models/Filter';
import { SideFilterConversorUtils } from '@shared/components/side-filter/utils/side-filter-conversor.utils';
import { IndicatorService } from '@app/services/indicator.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScheduledService } from '@app/http/scheduled.service';
import { ToastService } from '@app/services/toast.service';
import { LoggerUtils } from '@shared/utils/logger.utils';

@Component({
  templateUrl: './standart.component.html',
  styleUrls: ['./standart.component.scss']
})
export class StandartComponent implements OnInit {
  selects: SelectableFilter[] = [];

  chartLabels: Label[] = ['No Praso', 'Atrasados'];
  chartColors = ['#4b4279', 'lightgray'];
  openData = [[]];
  closedData = [[]];

  filters: any;

  constructor(
    private _filterService: FilterService,
    private _scheduledService: ScheduledService,
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {
    const categories$ = this._filterService.requestCategorias();
    const departments$ = this._filterService.requestDepartments();
    const indicators$ = this._filterService.requestIndicators();

    combineLatest([categories$, departments$, indicators$])
      .pipe(
        map(([categories, departments, indicators]) => ({ categories, departments, indicators }))
      )
      .subscribe(
        filterRequest => {
          this._parse(filterRequest.categories, 'Categorias', 'categoria');
          this._parse(filterRequest.indicators, 'Indicadores', 'indicador');
          this._parse(filterRequest.departments, 'Departamentos', 'departamento', true);
        },
        err => {
          this._error('Não foi possível iniciar o filtro', err);
        }
      );
  }

  setFilter(event: any) {
    this.filters = event;
    this.fetch();
  }

  private _parse(subscriptions: any, title: string, id: string, multiple?: boolean) {
    this.selects.push(SideFilterConversorUtils.parse(subscriptions.records, title, id, multiple));
  }

  fetch() {
    const filter = SideFilterConversorUtils.convertToDashboardRequest(this.filters);
    this._scheduledService.getServicoProgramado(filter).subscribe(
      (results: any) => {
        const rec = results.records;
        this.openData = [rec.abertoNoPrazo, rec.abertoAtrasado];
        this.closedData = [rec.encerradoNoPrazo, rec.encerradoAtrasado];
      },
      err => {
        this._error('Falha ao obter os serviços programados', err);
      }
    );
  }

  private _error(message: string, error: any) {
    this._toastService.show(message, 'danger');
    LoggerUtils.throw(error);
  }
}
