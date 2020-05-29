import { IndicatorService } from '@app/services/indicator.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FilterService } from '@app/services/filter.service';
import { SelectableFilter } from '@shared/models/Filter';
import { SideFilterConversorUtils } from '@shared/components/side-filter/utils/side-filter-conversor.utils';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, PluginServiceGlobalRegistrationAndOptions, Color } from 'ng2-charts';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { map, debounceTime, delay, timeout } from 'rxjs/operators';
import { SideFilterInterceptLocation } from '@shared/components/side-filter/side-filter.component';

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
  filterInterceptor: {
    place: SideFilterInterceptLocation.EMIT;
    function: (param?: any) => any | void;
  } = {
    place: SideFilterInterceptLocation.EMIT,
    function: (selects: SelectableFilter[], param?: any) => {
      if (!param.indicador && param.indicador !== '') {
        const indicators = selects.filter(sel => sel.id === 'indicador')[0];
        param.indicador = indicators.options[0].value;
      }
      return param;
    }
  };

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

  public labels: Label[] = ['Encerrado', 'Aberto', 'Atrasado'];
  public chartColors: Array<any> = [
    {
      backgroundColor: ['#4b4279', 'lightgrey', '#d9587f']
    }
  ];

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
        const txt = `${Math.round((data[0] * 100) / data.reduce((a, b) => a + b, 0))}%`;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

        ctx.font = '45px Montserrat,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
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
    this.selectsSubject.pipe(debounceTime(300)).subscribe(() => {
      const s = this.selects;
      this.selects = [];
      setTimeout(() => {
        this.selects = s;
      }, 1);
    });

    this.filterChangedSubject.pipe(debounceTime(300)).subscribe((filter: any) => {
      this.filter = filter;

      this.getInfo();
    });
  }

  ngOnInit() {
    const indicators$ = this.filterService.requestIndicators();
    const departments$ = this.filterService.requestDepartments();

    combineLatest([indicators$, departments$])
      .pipe(map(([indicators, departments]: any[]) => ({ indicators, departments })))
      .subscribe(filterRequest => {
        this.indicators = filterRequest.indicators.records;
        this.parse(filterRequest.indicators, 'Indicadores', 'indicador');
        this.parse(filterRequest.departments, 'Departamentos', 'departamento', true);
      });

    window.sessionStorage.removeItem('user-refresh-time');
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
    this.checkUserRefreshTime();
  }

  getInfo() {
    this.isLoading = true;
    this.charts = [];
    this.data = [];

    const length = this.filter.indicador === '' ? this.indicators.length : 1;

    if (length === 1) {
      this.indicatorService
        .getIndicatorById(this.filter.indicador)
        .subscribe((res: any) => (this.indicatorTitle = res.record.descricao));
    } else {
      this.indicatorTitle = 'TODOS OS INDICADORES';
    }

    for (let index = 0; index < length; index++) {
      this.indicatorService
        .getServicoProgramado(this.filter, length > 1 ? this.indicators[index].id : null)
        .subscribe(
          (indicador: any) => {
            this.data = this.data.concat(indicador.records);

            if (this.data.length > 1 && index === length - 1) {
              if (this.data.length === 2) {
                this.data = this.data.concat(this.data);
              }

              const data = this.data;

              this.data = [data[data.length - 3], data[data.length - 2], data[data.length - 1]]
                .concat(this.data)
                .concat([data[0], data[1], data[2]]);
            }

            const charts = [];

            this.data.forEach(indicator => {
              charts.push([
                {
                  data: [
                    indicator.encerradoNoPrazo + indicator.encerradoAtrasado,
                    indicator.abertoNoPrazo,
                    indicator.abertoAtrasado
                  ],
                  label: indicator.nomeGrafico
                }
              ]);
            });

            this.charts = charts;
          },
          err => {
            this.charts = [];
            this.data = [];
            this.isLoading = false;
          },
          () => {
            setTimeout(() => {
              this.isLoading = false;
              this.updateUsers();
            }, 300);
          }
        );
    }
  }

  getPercentage(user) {
    return Math.round(
      ((user.encerradoAtrasado + user.encerradoNoPrazo) * 100) /
        (user.abertoAtrasado + user.abertoNoPrazo + user.encerradoAtrasado + user.encerradoNoPrazo)
    );
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

    // Marca a hora foi feito o request dos usuarios
    window.sessionStorage.setItem('user-refresh-time', new Date().getTime().toString());
  }

  // Método chamado sempre que muda o slide para verificar se deve atualizar a lista de usuarioss
  checkUserRefreshTime() {
    const previousTime = +window.sessionStorage.getItem('user-refresh-time');
    const newTime = new Date().getTime();

    // Verifica se já passou 10 minutos desde a ultima atualização da lista de usuarios
    if (newTime - previousTime > 600000) {
      this.updateUsers();
    }
  }

  onFilterChange(filter: any) {
    this.filterChangedSubject.next(filter);
  }

  private parse(subscriptions: any, title: string, id: string, multiple?: boolean) {
    this.selects.push(SideFilterConversorUtils.parse(subscriptions.records, title, id, multiple));

    this.selectsSubject.next();
  }
}
