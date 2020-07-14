import { IndicatorService } from '@app/services/indicator.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FilterService } from '@app/services/filter.service';
import { SelectableFilter } from '@shared/models/Filter';
import { SideFilterConversorUtils } from '@shared/components/side-filter/utils/side-filter-conversor.utils';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';
import { combineLatest, Subject, interval } from 'rxjs';
import { map, debounceTime, finalize } from 'rxjs/operators';
import { DateUtils } from '@shared/utils/date.utils';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AnalyticsComponent implements OnInit {
  selects: SelectableFilter[] = [];
  selectsSubject = new Subject();

  filter: any;
  filterChangedSubject = new Subject<any>();

  indicators = [];

  slideConfig = {
    centerMode: true,
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 12000,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          centerMode: true,
          slidesToShow: 1
        }
      }
    ]
  };

  public labels: Label[] = ['Encerrado', 'Aberto no Prazo', 'Aberto Atrasado'];
  public chartColors = [{ backgroundColor: ['#4b4279', 'lightgrey', '#d9587f'] }];

  public chartOptions: ChartOptions = {
    legend: {
      display: false
    },
    cutoutPercentage: 85,
    responsive: true
  };

  // PLUGIN PARA INSERIR TEXTO DENTRO DO DOUGHNUT CHART
  public doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [
    {
      beforeDraw(chart: any) {
        const ctx = chart.ctx;

        // DADOS DO GRÁFICO
        const data = chart.config.data.datasets[0].data;

        // REGRA DE 3 PRA DESCOBRIR A PORCENTAGEM DE ENCERRADOS
        const txt =
          ((data[0] * 100) / data.reduce((a, b) => a + b, 0)).toFixed(1).replace(/\./g, ',') + '%';

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

        ctx.font = '38px Montserrat,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        ctx.fillStyle = '#4b4279';

        // Draw text in center
        ctx.fillText(txt, centerX, centerY);
      }
    }
  ];

  isLoading = true;

  // Dados dos indicadores
  data = [];

  // Dados dos indicadores só que formatados para gráfico
  charts: ChartDataSets[][] = [];

  users = [];

  selectedIndicator: any = { id: 'none' };

  indicatorTitle: string;

  constructor(private filterService: FilterService, private indicatorService: IndicatorService) {
    this.selectsSubject.pipe(debounceTime(300)).subscribe(async () => {
      const s = this.selects;
      this.selects = [];
      await this._delay(1);
      this.selects = s;
    });

    this.filterChangedSubject.pipe(debounceTime(300)).subscribe((filter: any) => {
      this.filter = filter;
      this.getInfo();
    });
  }

  ngOnInit() {
    this.refreshFilter();

    const period = 1000 * 60 * 10; // 10 minutos em milisegundos.
    interval(period).subscribe(() => this.updateUsers());
  }

  refreshFilter(filter?: any) {
    const reference = new Date();
    const startDate = DateUtils.iterateDays(-1, date => date.getDate() === 1).getTime();
    const endDateReference = DateUtils.iterateDays(1, date => {
      return (
        date.getDate() === 1 &&
        (date.getMonth() === reference.getMonth() + 1 || date.getMonth() === 0)
      );
    });
    const endDate = new Date(endDateReference.getTime() - 24 * 60 * 60 * 1000).getTime();

    if (filter) {
      this.filter = filter;
    }

    const indicators$ = this.filterService.requestIndicators();
    const departments$ = this.filterService.requestDepartments(startDate, endDate);

    combineLatest([indicators$, departments$])
      .pipe(map(([indicators, departments]: any[]) => ({ indicators, departments })))
      .subscribe(filterRequest => {
        this.selects = [];
        this.indicators = filterRequest.indicators.records;
        this.parse(filterRequest.indicators, 'Indicadores', 'indicador');
        this.parse(filterRequest.departments, 'Departamentos', 'departamento', true);
      });
  }

  slickInit(e) {
    if (this.data.length > 1) {
      e.slick.currentSlide = 3;
      e.slick.refresh();
      this.selectedIndicator = this.data[3];
    } else {
      this.selectedIndicator = this.data[0];
    }
  }

  afterChange(e) {
    if (e.slick.currentSlide === this.charts.length - 3) {
      e.slick.currentSlide = 3;
      e.slick.refresh();
    }
    if (e.slick.currentSlide === 2) {
      e.slick.currentSlide = this.charts.length - 4;
      e.slick.refresh();
    }
    this.selectedIndicator = this.data[e.slick.currentSlide];
    this.indicatorTitle = this.selectedIndicator.nomeIndicador;
  }

  getInfo() {
    if (!this.indicators?.length) {
      return;
    }

    this.isLoading = true;
    this.charts = [];
    this.data = [];

    const filter = this.filter || {};

    const length = filter.indicador === '' ? this.indicators.length : 1;

    // let indicatorSelected = '';

    // if (filter.indicador === '') {
    //   //// NÃO ME PERGUNTE OQ Q ESSE TROÇO AQUI FAZ
    //   if (this.indicators.length) {
    //     indicatorSelected = this.indicators[0].id;
    //   }
    // } else {
    //   indicatorSelected = filter.indicador;
    // }

    if (filter.indicador !== '') {
      this.indicatorService
        .getIndicatorById(filter.indicador)
        .subscribe((res: any) => (this.indicatorTitle = res.record.descricao));
      // Esse else faz sentido?
    } else {
      this.data = [];
      const indicators$ = this.indicators.map(indicator =>
        this.indicatorService.getServicoProgramado(this.filter, indicator.id)
      );
      combineLatest(indicators$)
        .pipe(
          map((results: { records: any[]; status: string }[]) => {
            let recs = [];
            results.forEach(res => (recs = recs.concat(res.records)));
            return recs;
          }),
          finalize(() => (this.isLoading = false))
        )
        .subscribe(
          records => {
            console.log(records);

            this.data = records;
            this.charts = this.data.map(ind => {
              return [
                {
                  data: [
                    ind.encerradoNoPrazo + ind.encerradoAtrasado,
                    ind.abertoNoPrazo,
                    ind.abertoAtrasado
                  ],
                  label: ind.nomeGrafico
                }
              ];
            });
            this.updateUsers();
            const index = this.filter.indicador === '' ? this.indicators.length : 1;
            if (this.data.length > 1 && index === length - 1) {
              if (this.data.length === 2) {
                this.data = this.data.concat(this.data);
              }

              const data = this.data;

              this.data = [data[data.length - 3], data[data.length - 2], data[data.length - 1]]
                .concat(this.data)
                .concat([data[0], data[1], data[2]]);
            }
          },
          err => {
            this.charts = [];
            this.data = [];
          }
        );
      // .pipe(map((result: any[]) => ({ indicators, departments })))
      // this.indicators.forEach(indicator => {
      //   this.indicatorService.getServicoProgramado(this.filter, indicator).subscribe((indicador: any) => {

      //     this.data = this.data.concat(indicador.records);
      //     this.charts = this.data.map(ind => {
      //       return [{
      //         data: [
      //           ind.encerradoNoPrazo + ind.encerradoAtrasado,
      //           ind.abertoNoPrazo,
      //           ind.abertoAtrasado
      //         ],
      //         label: ind.nomeGrafico
      //       }];
      //     });

      //   }, err => {
      //     this.charts = [];
      //     this.data = [];
      //     this.isLoading = false;
      //   });
      // });
    }

    // for (let index = 0; index < length; index++) {
    //   this.indicatorService.getServicoProgramado(this.filter, indicatorSelected).subscribe(
    //     (indicador: any) => {
    //       this.data = this.data.concat(indicador.records);

    //       if (this.data.length > 1 && index === length - 1) {
    //         if (this.data.length === 2) {
    //           this.data = this.data.concat(this.data);
    //         }

    //         const data = this.data;

    //         this.data = [data[data.length - 3], data[data.length - 2], data[data.length - 1]]
    //           .concat(this.data)
    //           .concat([data[0], data[1], data[2]]);
    //       }

    //       this.charts = this.data.map(ind => {
    //         return [
    //           {
    //             data: [
    //               ind.encerradoNoPrazo + ind.encerradoAtrasado,
    //               ind.abertoNoPrazo,
    //               ind.abertoAtrasado
    //             ],
    //             label: ind.nomeGrafico
    //           }
    //         ];
    //       });
    //     },
    //     err => {
    //       this.charts = [];
    //       this.data = [];
    //       this.isLoading = false;
    //     },
    //     () => {
    //       setTimeout(() => {
    //         this.isLoading = false;
    //         this.updateUsers();
    //       }, 300);
    //     }
    //   );
    // }
  }

  getPercentage(user) {
    return +(
      ((user.encerradoAtrasado + user.encerradoNoPrazo) * 100) /
      (user.abertoAtrasado + user.abertoNoPrazo + user.encerradoAtrasado + user.encerradoNoPrazo)
    ).toFixed(1);
  }

  valueStringify(value: number) {
    return value.toString().replace(/\./g, ',');
  }

  updateUsers() {
    this.data.forEach(indicator => {
      this.indicatorService
        .getUsers(this.filter, indicator.id)
        .pipe(debounceTime(300))
        .subscribe((res: any) => {
          this.users[indicator.id] = res.records;
        });
    });
  }

  onFilterChange(filter: any) {
    this.filterChangedSubject.next(filter);
  }

  private parse(subscriptions: any, title: string, id: string, multiple?: boolean) {
    this.selects.push(SideFilterConversorUtils.parse(subscriptions.records, title, id, multiple));

    this.selectsSubject.next();
  }

  private _delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
