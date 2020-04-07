import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { LoggerUtils } from '@shared/utils/logger.utils';
import { FilterService } from '@app/services/filter.service';
import { SelectableFilter } from '@shared/models/Filter';
import { DateUtils } from '@shared/utils/date.utils';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from './providers/format-datepicker';

@Component({
  selector: 'app-side-filter',
  templateUrl: './side-filter.component.html',
  styleUrls: ['./side-filter.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class SideFilterComponent implements OnInit {
  @Input() STORAGE_KEY: string;
  @Input() mustHaveDateFilter = true;
  @Input() selects: SelectableFilter[];

  @Output() filters: EventEmitter<any> = new EventEmitter();

  opened = false;
  selecteds: any = {};
  selectedValues: { id: string; name: string }[] = [];

  startDate: Date;
  endDate: Date;

  constructor(private _filterService: FilterService) {}

  ngOnInit(): void {
    this.selects.forEach(sel => {
      if (sel.id.includes(' ') || sel.id === 'names') {
        LoggerUtils.throw(new Error('ID inválido para o select de filtros'));
      }
      sel.options.forEach(opt => {
        if (opt.value.includes(' ')) {
          LoggerUtils.throw(new Error('O value das opções do select não pode conter espaços'));
        }
      });
    });

    if (this.STORAGE_KEY) {
      const cache = this._filterService.getFilters(this.STORAGE_KEY);
      if (cache) {
        this.selectedValues = cache.selectedValues || [];
        this.startDate = cache.startDate || '';
        this.endDate = cache.endDate || '';
        delete cache.selectedValues;
        delete cache.startDate;
        delete cache.endDate;
        this.selecteds = cache || {};
      }
    }
  }

  today() {
    this.startDate = new Date();
    this.endDate = new Date();
  }

  thisWeek() {
    this.startDate = DateUtils.iterateDays(-1, date => date.getDay() === 0);
    this.endDate = DateUtils.iterateDays(1, date => date.getDay() === 6);
  }

  thisMonth() {
    const reference = new Date();
    this.startDate = DateUtils.iterateDays(
      -1,
      date => date.getDate() === 0 && date.getMonth() === reference.getMonth()
    );
    const endDate = DateUtils.iterateDays(1, date => {
      return (
        date.getDate() === 0 &&
        (date.getMonth() === reference.getMonth() + 1 || date.getMonth() === 0)
      );
    });
    this.endDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000 * -1);
  }

  lastMonth() {}

  select(event: { id: string; name: string; value: string }) {
    this._add(event.id, event.value);
    this._storeValues(event.id, event.name);
    this.selecteds.startDate = this.startDate;
    this.selecteds.endDate = this.endDate;
    this.filters.emit(this.selecteds);
    this._store();
  }

  getSelectedValue(id: string) {
    const index = this.selectedValues.map(sv => sv.id).indexOf(id);
    if (this.selectedValues[index]) {
      return this.selectedValues[index].name;
    } else {
      return '';
    }
  }

  private _storeValues(id: string, name: string) {
    const array = this.selectedValues.map(sv => sv.id);
    const index = array.indexOf(id);
    if (index >= 0) {
      this.selectedValues[index].name = name;
    } else {
      this.selectedValues.push({ id, name });
    }
  }

  private _add(id: string, value: string) {
    this.selecteds[id] = value;
    // if (Object.keys(this.selecteds).includes(id)) {
    //   const array: string[] = this.selecteds[id];
    //   if (array.includes(value)) {
    //     array.splice(array.indexOf(value), 1);
    //   } else {
    //     array.push(value);
    //   }
    //   this.selecteds[id] = array;
    // } else {
    //   this.selecteds[id] = [value];
    // }
  }

  private _store() {
    if (this.STORAGE_KEY) {
      const object = Object.assign(this.selecteds, { selectedValues: this.selectedValues });
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(object));
    }
  }
}
