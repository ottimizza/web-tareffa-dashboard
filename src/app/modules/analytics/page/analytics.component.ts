import { IndicatorService } from '@app/services/indicator.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FilterService } from '@app/services/filter.service';
import { SelectableFilter } from '@shared/models/Filter';
import { SideFilterConversorUtils } from '@shared/components/side-filter/utils/side-filter-conversor.utils';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, PluginServiceGlobalRegistrationAndOptions, Color } from 'ng2-charts';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { SideFilterInterceptLocation } from '@shared/components/side-filter/side-filter.component';
import { DateUtils } from '@shared/utils/date.utils';
import { JSONUtils } from '@shared/utils/json.utils';

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
        param.indicador = indicators ? indicators.options[0].value : null;
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

  public labels: Label[] = ['Encerrado', 'Aberto no Prazo', 'Aberto Atrasado'];
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
    this.selectsSubject.pipe(debounceTime(300)).subscribe(() => {
      const s = this.selects;
      this.selects = [];
      setTimeout(() => {
        this.selects = s;
      }, 1);
    });

    this.filterChangedSubject.pipe(debounceTime(300)).subscribe((filter: any) => {
      if (this.filter?.startDate === filter.startDate && this.filter?.endDate === filter.endDate) {
        this.filter = JSONUtils.reBuildWithDate(filter);
      } else {
        this.refreshFilter(filter);
      }

      this.getInfo();
    });
  }

  ngOnInit() {
    this.refreshFilter();
    window.sessionStorage.removeItem('user-refresh-time');
  }

  refreshFilter(filter?: any) {
    const reference = new Date();
    let startDate = DateUtils.iterateDays(-1, date => date.getDate() === 1).getTime();
    const endDateReference = DateUtils.iterateDays(1, date => {
      return (
        date.getDate() === 1 &&
        (date.getMonth() === reference.getMonth() + 1 || date.getMonth() === 0)
      );
    });
    let endDate = new Date(endDateReference.getTime() - 24 * 60 * 60 * 1000).getTime();

    if (filter) {
      this.filter = filter;
    }

    if (this.filter?.startDate) {
      startDate = new Date(this.filter.startDate).getTime();
    }
    if (this.filter?.endDate) {
      endDate = new Date(this.filter.endDate).getTime();
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
    this.checkUserRefreshTime();
  }

  getInfo() {
    this.isLoading = true;
    this.charts = [];
    this.data = [];

    if (this.indicators && this.indicators.length === 0) {
      this.isLoading = false;
      return;
    }

    const length = this.filter.indicador === '' ? this.indicators.length : 1;

    let indicatorSelected = '';

    if (this.filter.indicador === '') {
      if (this.indicators.length) {
        indicatorSelected = this.indicators[0].id;
      }
    } else {
      indicatorSelected = this.filter.indicador;
    }

    if (indicatorSelected) {
      this.indicatorService
        .getIndicatorById(indicatorSelected)
        .subscribe((res: any) => (this.indicatorTitle = res.record.descricao));
    }

    for (let index = 0; index < length; index++) {
      this.indicatorService.getServicoProgramado(this.filter, indicatorSelected).subscribe(
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
