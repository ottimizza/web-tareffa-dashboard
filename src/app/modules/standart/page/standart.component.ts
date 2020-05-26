import { Component, OnInit, OnDestroy } from '@angular/core';
import { combineLatest, Subscription, interval } from 'rxjs';
import { map } from 'rxjs/operators';

import { MatDialog } from '@angular/material';

import { CollaboratorListDialogComponent } from '../dialogs/collaborator-list/collaborator-list-dialog.component';
import { SideFilterConversorUtils } from '@shared/components/side-filter/utils/side-filter-conversor.utils';
import { ScheduledService } from '@app/http/scheduled.service';
import { ToastService } from '@app/services/toast.service';
import { LoggerUtils } from '@shared/utils/logger.utils';
import { SelectableFilter } from '@shared/models/Filter';
import { DateUtils } from '@shared/utils/date.utils';

@Component({
  templateUrl: './standart.component.html',
  styleUrls: ['./standart.component.scss']
})
export class StandartComponent implements OnInit, OnDestroy {
  selects: SelectableFilter[] = [];

  chartColors = ['#4b4279', 'lightgray'];

  encerradoNoPrazo = 0;
  encerradoAtrasado = 0;
  abertoNoPrazo = 0;
  abertoAtrasado = 0;
  encerrado = 0;
  aberto = 0;

  filters: any;

  interval: Subscription;

  itemList: any[] = [];
  selectedCard: number;
  term: [0] | [1, 2];

  constructor(
    private _service: ScheduledService,
    private _toastService: ToastService,
    public dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    this.interval.unsubscribe();
  }

  ngOnInit(): void {
    this.interval = interval(30 * 60 * 1000) // 30 minutos
      .subscribe(() => {
        const date = new Date();
        console.log(
          `Tentando obter os serviços programados: ${date.getHours()}:${date.getMinutes()}`
        );
        this.fetch();
      });

    const categories$ = this._service.getCategory();
    const services$ = this._service.getGroupedScheduled(0);
    const departments$ = this._service.getGroupedScheduled(1);
    const caracteristics$ = this._service.getCharacteristic();

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

  openDialog(id: number, date: string, title: string): void {
    const dates = date.split('/');
    const filter = this.filters;
    filter.prazo = this.term;
    filter.situacao = this.selectedCard;
    const body = {
      dataProgramada: new Date(`${dates[2]}-${dates[1]}-${dates[0]}`).getTime(),
      filtro: filter
    };
    const dialogRef = this.dialog.open(CollaboratorListDialogComponent, {
      width: '568px',
      data: { title, filter, id, body }
    });
    dialogRef.afterClosed().subscribe();
  }

  formatter(n: number) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  getGrouped(term: [0] | [1, 2], situation: 1 | 2) {
    const filter = this.filters;
    filter.prazo = term;
    filter.situacao = situation;

    this._toastService.showSnack('Obtendo detalhes');
    this._service.getGroupedScheduled(2, filter).subscribe((results: any) => {
      this._toastService.hideSnack();
      this.selectedCard = situation;
      this.term = term;
      const primaryDateList = results.records.map(rec => rec.dataProgramada);
      const dateList = [];
      primaryDateList.forEach(date => {
        if (!dateList.includes(date)) {
          dateList.push(date);
        }
      });
      this.itemList = dateList.map(date => {
        const dates = date.split('-');
        const items = results.records.filter(rec => rec.dataProgramada === date);
        return {
          data: `${dates[2]}/${dates[1]}/${dates[0]}`,
          value: items.map(item => {
            return {
              servicosProgramadosContagem: item.servicosProgramadosContagem,
              nomeServico: item.nomeServico,
              id: item.id
            };
          })
        };
      });
    });
  }

  private _parse(subscriptions: any, title: string, id: string, multiple?: boolean) {
    this.selects.push(SideFilterConversorUtils.parse(subscriptions.records, title, id, multiple));
  }

  close() {
    this.selectedCard = 0;
    this.itemList = [];
  }

  floor(num: number) {
    return this._safeNumberValue(num)
      .toFixed(1)
      .replace(/\./g, ',');
  }

  dateFormat(date: any) {
    return DateUtils.format(new Date(date));
  }

  fetch(filters = this.filters) {
    this._toastService.showSnack('Obtendo serviço programado');
    this._service.getServicoProgramado(filters).subscribe(
      (results: any) => {
        this._toastService.hideSnack();
        const rec = results.records;
        const snv = this._safeNumberValue;

        this.abertoNoPrazo = snv(rec.abertoNoPrazo);
        this.abertoAtrasado = snv(rec.abertoAtrasado);
        this.encerradoAtrasado = snv(rec.encerradoAtrasado);
        this.encerradoNoPrazo = snv(rec.encerradoNoPrazo);

        this.aberto = this.abertoNoPrazo + this.abertoAtrasado;
        this.encerrado = this.encerradoAtrasado + this.encerradoNoPrazo;
      },
      err => {
        this._error('Falha ao obter os serviços programados', err);
      }
    );
  }

  getData(data: number[]) {
    return this.abertoAtrasado +
      this.encerradoAtrasado +
      this.abertoNoPrazo +
      this.encerradoNoPrazo >
      0
      ? data
      : [0, -1];
  }

  private _error(message: string, error: any) {
    this._toastService.show(message, 'danger');
    LoggerUtils.throw(error);
  }

  private _safeNumberValue(num: any) {
    return +`${num || 0}` || 0;
  }
}
