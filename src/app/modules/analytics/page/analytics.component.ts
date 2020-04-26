import { IndicatorService } from '@app/services/indicator.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FilterService } from '@app/services/filter.service';
import { SelectableFilter } from '@shared/models/Filter';
import { SideFilterConversorUtils } from '@shared/components/side-filter/utils/side-filter-conversor.utils';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { combineLatest, Subject } from 'rxjs';
import { map, timeout, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsComponent implements OnInit {
  selects: SelectableFilter[] = [];

  filter: any;

  indicators = [];

  slideConfig = {
    centerMode: true,
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 2000,
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
  public chartOptions: ChartOptions = {
    legend: {
      display: false
    }
  };

  selectsSubject = new Subject();

  charts: ChartDataSets[][] = [];
  data = [];

  auto = true;

  constructor(private filterService: FilterService, private indicatorService: IndicatorService) {
    this.selectsSubject.pipe(debounceTime(300)).subscribe(() => {
      const s = this.selects;
      this.selects = [];
      setTimeout(() => {
        this.selects = s;
      }, 1);
    });
  }

  ngOnInit() {
    const indicators$ = this.filterService.requestIndicators();
    const departments$ = this.filterService.requestDepartments();

    combineLatest([indicators$, departments$])
      .pipe(map(([indicators, departments]) => ({ indicators, departments })))
      .subscribe(filterRequest => {
        this.parse(filterRequest.indicators, 'Indicadores', 'indicador');
        this.parse(filterRequest.departments, 'Departamentos', 'departamento', true);
      });
  }

  slickInit(e) {
    e.slick.currentSlide = 3;
    e.slick.refresh();
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
  }

  getInfo() {
    this.indicatorService.getServicoProgramado(this.filter).subscribe((indicador: any) => {
      this.charts = [];
      this.data = [];
      this.data = indicador.records;

      if (this.data.length > 1) {
        if (this.data.length === 2) {
          this.data = this.data.concat(this.data);
        }

        const data = this.data;

        this.data = [data[data.length - 3], data[data.length - 2], data[data.length - 1]]
          .concat(this.data)
          .concat([data[0], data[1], data[2]]);
      }

      this.data.forEach(indicator => {
        this.charts.push([
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
    });
  }

  onFilterChange(filter: any) {
    this.filter = filter;
    this.getInfo();
  }

  private parse(subscriptions: any, title: string, id: string, multiple?: boolean) {
    this.selects.push(SideFilterConversorUtils.parse(subscriptions.records, title, id, multiple));

    this.selectsSubject.next();
  }
}
