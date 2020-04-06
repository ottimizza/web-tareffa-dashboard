import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SelectableFilter } from '@shared/components/side-filter/side-filter.component';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsComponent implements OnInit {
  selects: SelectableFilter[] = [
    {
      title: 'Categoria',
      id: 'categories',
      options: [
        {
          name: 'Todas as categorias',
          value: 'all'
        }
      ]
    },
    {
      title: 'Serviços',
      id: 'services',
      options: [
        {
          name: 'Balancete',
          value: 'balancete'
        },
        {
          name: 'DAS - Guia Simples Nacional',
          value: 'DAS'
        },
        {
          name: '01 - Definição dos Requisitos / Planejamento',
          value: '1'
        },
        {
          name: '02 - Prototipação de Tela',
          value: '2'
        },
        {
          name: '03 - Desenvolvimento',
          value: '3'
        },
        {
          name: '04 - Testes / Homologações',
          value: '4'
        },
        {
          name: '05 - Em BETA (Produção)',
          value: '5'
        },
        {
          name: '06 - Não sei o que é o 6',
          value: '6'
        },
        {
          name: '07 - Liberar projeto para produção',
          value: '07'
        }
      ]
    },
    {
      title: 'Unidades de Negócio',
      id: 'product',
      options: [
        {
          name: 'Todas as Un. de negócio',
          value: 'all'
        },
        {
          name: 'Bússola Contábil 3.0',
          value: 'bussola3'
        },
        {
          name: 'OIC 3.0',
          value: 'oic3'
        },
        {
          name: 'CS - Sugestão de Melhoria',
          value: 'cssm'
        },
        {
          name: 'CS - Status Report',
          value: 'cssr'
        },
        {
          name: 'CS - Cockpit Indicadores',
          value: 'csci'
        },
        {
          name: 'Micro Serviços',
          value: 'micro_services'
        }
      ]
    }
  ];

  constructor() {}

  ngOnInit() {}

  abaporu(event: any) {
    console.log(event);
  }
}
