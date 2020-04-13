import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FilterService } from '@app/services/filter.service';
import { SelectableFilter } from '@shared/models/Filter';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsComponent implements OnInit {
  selects: SelectableFilter[] = [
    {
      id: 'services',
      options: [
        {
          name: 'Balancete',
          value: 'balancete'
        },
        {
          name: 'DAS - Guia Simples Nacional',
          value: 'das'
        },
        {
          name: '03. Desenvolvimento',
          value: '03'
        }
      ],
      title: 'Serviços',
      multiple: true
    },
    {
      id: 'unidades',
      title: 'Un. de Negócio',
      options: [
        {
          name: 'Bússola Contábil 3.0',
          value: 'bussola'
        },
        {
          name: 'OIC 3.0',
          value: 'oic'
        },
        {
          name: 'CS - Sugestão de Melhoria',
          value: 'cssm'
        }
      ]
    }
  ];

  constructor(private _filterService: FilterService) {}

  ngOnInit() {
    this._filterService.requestIndicators().subscribe(a => console.log(a));
    this._filterService.requestCategorias().subscribe(a => console.log(a));
    this._filterService.requestDepartments().subscribe(a => console.log(a));
  }
}
