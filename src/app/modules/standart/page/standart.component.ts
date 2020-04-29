import { Component, OnInit } from '@angular/core';
import { Label } from 'ng2-charts';
import { SelectableFilter } from '@shared/models/Filter';
import { SideFilterConversorUtils } from '@shared/components/side-filter/utils/side-filter-conversor.utils';
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

  encerradoNoPrazo = 0;
  encerradoAtrasado = 0;
  abertoNoPrazo = 0;
  abertoAtrasado = 0;

  filters: any;

  constructor(private _service: ScheduledService, private _toastService: ToastService) {}

  ngOnInit(): void {
    const departments$ = this._service.getGroupedScheduled(1);
    const categories$ = this._service.getCategory();
    const caracteristics$ = this._service.getCharacteristic();
    const services$ = this._service.getGroupedScheduled(0);

    combineLatest([categories$, departments$, services$, caracteristics$])
      .pipe(
        map(([categories, departments, services, caracteristics]: any[]) => ({
          categories,
          departments,
          services,
          caracteristics
        }))
      )
      .subscribe(
        filterRequest => {
          this._parse(filterRequest.departments, 'Departamentos', 'departamento', true);
          this._parse(filterRequest.categories, 'Categorias', 'categoria');
          this._parse(filterRequest.services, 'Serviços', 'servico', true);
          this._parse(filterRequest.caracteristics, 'Un. de Negócio', 'caracteristica');
        },
        err => {
          this._error('Não foi possível iniciar o filtro', err);
        }
      );
  }

  setFilter(event: any) {
    this.filters = SideFilterConversorUtils.convertToDashboardRequest(event);
    this.fetch();
  }

  private _parse(subscriptions: any, title: string, id: string, multiple?: boolean) {
    this.selects.push(SideFilterConversorUtils.parse(subscriptions.records, title, id, multiple));
  }

  fetch(filters = this.filters) {
    this._service.getServicoProgramado(filters).subscribe(
      (results: any) => {
        const rec = results.records;
        this.openData = [rec.abertoNoPrazo, rec.abertoAtrasado];
        this.closedData = [rec.encerradoNoPrazo, rec.encerradoAtrasado];

        this.abertoNoPrazo = rec.abertoNoPrazo ?? 0;
        this.abertoAtrasado = rec.abertoAtrasado ?? 0;
        this.encerradoAtrasado = rec.encerradoAtrasado ?? 0;
        this.encerradoNoPrazo = rec.encerradoNoPrazo ?? 0;
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
