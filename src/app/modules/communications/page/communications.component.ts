import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectableFilter } from '@shared/models/Filter';
import { MatDialog, MatSort, Sort } from '@angular/material';
import { CommunicationsListComponent } from '../dialogs/communications-list/communications-list.component';
import { StringUtils } from '@shared/utils/string.utils';
import { PageInfo } from '@shared/models/GenericPageableResponse';

interface UserCommunications {
  name: string;
  communicationsAmount: number;
}

@Component({
  templateUrl: './communications.component.html',
  styleUrls: ['./communications.component.scss']
})
export class CommunicationsComponent implements OnInit {
  // Doughnut Chart
  aberto = 424;
  encerrado = 497;

  chartColors = ['#4b4279', 'lightgray'];

  // Bar Chart
  barChartLabels: any = [];
  barChartData: any = [{ data: 0, label: '' }];

  // Filter
  date = new Date();
  selects: SelectableFilter[] = [];

  // Table
  users: Array<UserCommunications>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['name', 'value'];
  dataSource = this.users;
  public pageInfo: PageInfo = new PageInfo();
  public sortInfo: any = null;

  // Data

  newerCommunications: any;
  unredMessages = Array<any>();
  horizontalBar = Array<any>();
  communicationTypes = Array<any>();
  userCommunications = Array<any>();

  // Fake JSONs

  fakeJSONUserCommunications = `{
    "userCommunications": [
      {
        "name": "Leonardo",
        "value": 123
      },
      {
        "name": "Rodrigo",
        "value": 456
      },
      {
        "name": "Diogo",
        "value": 789
      },
      {
        "name": "Rodrigo",
        "value": 456
      },
      {
        "name": "Diogo",
        "value": 789
      },
      {
        "name": "Rodrigo",
        "value": 456
      },
      {
        "name": "Diogo",
        "value": 789
      },
      {
        "name": "Rodrigo",
        "value": 456
      },
      {
        "name": "Diogo",
        "value": 789
      }
    ]
  }
  `;

  fakeJSONNewerCommunication = `
    {
      "newerComunications": {
        "title": "Novas Comunicações",
        "value": 423543
      }
    }
  `;

  fakeJSONCommunicationType = `
    {
      "communicationType": [
        {
          "title": "Internas",
          "value": 12333
        },
        {
          "title": "Enviadas",
          "value": 423
        },
        {
          "title": "Recebidas",
          "value": 100000
        }
      ]
    }
  `;

  fakeJSONUnreadMessages = `
    {
      "unreadMessages": [
        {
          "title": "Não lidas pela contabilidade",
          "value": 7
        },
        {
          "title": "Não lidas pelo cliente",
          "value": 102365
        }
      ]
    }
  `;

  fakeJSONHorizontalBar = `
    {
      "departments": [
        {
          "label": "Fiscal",
          "data": 200
        },
        {
          "label": "Contábil",
          "data": 157
        },
        {
          "label": "Administração",
          "data": 157
        },
        {
          "label": "Depto HumanosjhljgjhgHumanosjhljgjhgHumanosjhljgjhgHumanosjhljgjhg",
          "data": 98
        },
        {
          "label": "Outros",
          "data": 70
        }
      ]
    }
  `;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.fetch();

    this.newerCommunications = JSON.parse(this.fakeJSONNewerCommunication).newerComunications;
    this.communicationTypes = JSON.parse(this.fakeJSONCommunicationType).communicationType;
    this.unredMessages = JSON.parse(this.fakeJSONUnreadMessages).unreadMessages;
    this.userCommunications = JSON.parse(this.fakeJSONUserCommunications).userCommunications;
    this.horizontalBar = JSON.parse(this.fakeJSONHorizontalBar).departments;

    this.setHorizontalBarInfo();
  }

  fetch(pageIndex: number = 0, pageSize: number = 200, sort: Sort = null) {
    this.sortInfo = { 'sort.order': 'asc', 'sort.attribute': 'name' };
    if (sort && sort.active && sort.direction) {
      this.sortInfo = { 'sort.order': sort.direction, 'sort.attribute': sort.active };
    }

    this.users = JSON.parse(this.fakeJSONUserCommunications).userCommunications;

    this.dataSource = this.users;
  }

  setHorizontalBarInfo() {
    this.barChartData = this.horizontalBar;
    this.horizontalBar.forEach(department => {
      this.barChartLabels.push(StringUtils.cut(department.label, 15));
    });
  }

  openModalCommunicationList(title, id) {
    const size = screen.width < 768 ? '330px' : '400px';
    this.dialog.open(CommunicationsListComponent, {
      maxWidth: size,
      data: {
        title,
        id
      }
    });
  }

  setFilter(event) {
    console.log(event);
  }
}
