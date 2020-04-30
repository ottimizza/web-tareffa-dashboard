import { Component, OnInit, OnDestroy } from '@angular/core';
import { Label } from 'ng2-charts';
import { SelectableFilter } from '@shared/models/Filter';
import { SideFilterConversorUtils } from '@shared/components/side-filter/utils/side-filter-conversor.utils';
import { combineLatest, Subscription, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScheduledService } from '@app/http/scheduled.service';
import { ToastService } from '@app/services/toast.service';
import { LoggerUtils } from '@shared/utils/logger.utils';
import { MatDialog } from '@angular/material';
import { CollaboratorListDialogComponent } from '../dialogs/collaborator-list/collaborator-list-dialog.component';

@Component({
  templateUrl: './standart.component.html',
  styleUrls: ['./standart.component.scss']
})
export class StandartComponent implements OnInit, OnDestroy {
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

  openDialog(id: number): void {
    const filter = this.filters;
    filter.prazo = this.term;
    filter.situacao = this.selectedCard;
    const body = {
      dataProgramada: new Date(filter.dataProgramadaInicio),
      filtro: filter
    };
    this._service.getInformations(id, body).subscribe((aa: any) => {
      console.log(aa);
      const dialogRef = this.dialog.open(CollaboratorListDialogComponent, {
        width: '568px',
        data: aa.records
      });
      dialogRef.afterClosed().subscribe();
    });
  }

  getGrouped(term: [0] | [1, 2], situation: 1 | 2) {
    const filter = this.filters;
    filter.prazo = term;
    filter.situacao = situation;

    this._service.getGroupedScheduled(2, filter).subscribe((results: any) => {
      this.selectedCard = situation;
      this.term = term;
      const dateList = results.records.map(rec => rec.dataProgramada);
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
      // console.log(results);
      // this.itemList = results.records;
    });
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
