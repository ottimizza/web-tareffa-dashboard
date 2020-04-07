import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';

import { AppDateAdapter, APP_DATE_FORMATS } from './providers/format-datepicker';
import { StorageService } from '@app/services/storage.service';
import { SelectableFilter } from '@shared/models/Filter';
import { LoggerUtils } from '@shared/utils/logger.utils';
import { DateUtils } from '@shared/utils/date.utils';

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
  @Output() encodedFilters: EventEmitter<string> = new EventEmitter();

  opened = false;
  selecteds: any = {};
  selectedValues: { id: string; name: string }[] = [];

  startDate: Date;
  endDate: Date;

  constructor(private _storageService: StorageService) {}

  ngOnInit(): void {
    this.selects.forEach(sel => {
      if (sel.id.includes(' ') || sel.id === 'names') {
        LoggerUtils.throw(new Error('ID inválido para o select de filtros'));
      }
      sel.options = [{ value: '', name: `Todos os/as ${sel.title.toLowerCase()}` }].concat(
        sel.options
      );
      sel.options.forEach(opt => {
        if (opt.value.includes(' ')) {
          LoggerUtils.throw(new Error('O value das opções do select não pode conter espaços'));
        }
      });
    });

    if (this.STORAGE_KEY) {
      this._storageService.fetch(this.STORAGE_KEY).then(json => {
        const cache = JSON.parse(json);
        if (cache) {
          this.selectedValues = cache.selectedValues || [];
          this.startDate = cache.startDate || '';
          this.endDate = cache.endDate || '';
          delete cache.selectedValues;
          delete cache.startDate;
          delete cache.endDate;
          this.selecteds = cache || {};
        }
      });
    }
  }

  emit() {
    this.selecteds.startDate = this.startDate;
    this.selecteds.endDate = this.endDate;
    this.filters.emit(this.selecteds);
    this._encode(this.selecteds);
    this._store();
  }

  today() {
    this.startDate = new Date();
    this.endDate = new Date();
    this.emit();
  }

  thisWeek() {
    this.startDate = DateUtils.iterateDays(-1, date => date.getDay() === 0);
    this.endDate = DateUtils.iterateDays(1, date => date.getDay() === 6);
    this.emit();
  }

  thisMonth() {
    const reference = new Date();

    this.startDate = DateUtils.iterateDays(-1, date => date.getDate() === 1);
    const endDate = DateUtils.iterateDays(1, date => {
      return (
        date.getDate() === 1 &&
        (date.getMonth() === reference.getMonth() + 1 || date.getMonth() === 0)
      );
    });
    this.endDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
    this.emit();
  }

  lastMonth() {
    const reference = new Date();

    this.startDate = DateUtils.iterateDays(-1, date => {
      return (
        date.getDate() === 1 &&
        (date.getMonth() === reference.getMonth() - 1 || date.getMonth() === 11)
      );
    });
    const endDate = DateUtils.iterateDays(-1, date => date.getDate() === 1);
    this.endDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
    this.emit();
  }

  select(event: { id: string; name: string; value: string }) {
    this._add(event.id, event.value);
    this._storeValues(event.id, event.name);
    this.emit();
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
  }

  private _store() {
    if (this.STORAGE_KEY) {
      const object = Object.assign(this.selecteds, { selectedValues: this.selectedValues });
      this._storageService.store(this.STORAGE_KEY, JSON.stringify(object));
    }
  }

  private _encode(params: any): void {
    const code = Object.keys(params)
      .map(key => {
        return [key, params[key]].map(encodeURIComponent).join('=');
      })
      .join('&');
    this.encodedFilters.emit(code);
  }
}
