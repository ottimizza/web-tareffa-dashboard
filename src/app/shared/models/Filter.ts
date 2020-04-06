import { FormControl } from '@angular/forms';

export class SelectFilter {
  title: string;
  formControl: FormControl;
  data = [];
  filteredData = [];
  selectedData = [];
}

export class Filter {
  startDate: Date;
  endDate: Date;
  selectFilter: SelectFilter[] = [];

  constructor(filter?: Filter) {
    if (filter) {
      this.startDate = filter.startDate;
      this.endDate = filter.endDate;
      // this.selectFilter = filter.selectFilter;
    } else {
      const date = new Date();
      this.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      this.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
  }

  setStartDate(date: Date) {
    this.startDate = date;
  }

  setEndDate(date: Date) {
    this.endDate = date;
  }

  addSelect(title, data) {
    this.selectFilter.push({
      title,
      formControl: new FormControl(),
      data,
      filteredData: data,
      selectedData: data
    });
  }
}

export class MeuFiltro {
  startDate: Date;
  endDate: Date;
  itens: any[] = [];

  setStartDate(date: Date) {
    this.startDate = date;
  }

  setEndDate(date: Date) {
    this.endDate = date;
  }

  addItem(prop: string, value: string) {
    const obj: any = {};
    obj[prop] = value;
    this.itens.push(obj);
  }
}
