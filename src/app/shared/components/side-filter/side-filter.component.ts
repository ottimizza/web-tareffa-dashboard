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
  @Input() selects: SelectableFilter[] = [];

  @Output() filters: EventEmitter<any> = new EventEmitter();
  @Output() encodedFilters: EventEmitter<string> = new EventEmitter();

  opened = false;
  selecteds: any = {};
  cache: any;

  startDate: Date;
  endDate: Date;

  constructor(private _storageService: StorageService) {}

  ngOnInit(): void {
    this.selects.forEach(sel => {
      if (sel.id.includes(' ')) {
        LoggerUtils.throw(new Error('ID inválido para o select de filtros'));
      }
    });

    if (this.STORAGE_KEY) {
      this._restore();
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

  select(event: { id: string; value: string | string[] }) {
    this.selecteds[event.id] = event.value;
    this.emit();
  }

  activate() {
    this.opened = !this.opened;
    this.selects.sort((i1, i2) => (i1.title > i2.title ? 1 : i2.title > i1.title ? -1 : 0));
  }

  private _store() {
    if (this.STORAGE_KEY) {
      this._storageService.destroy(this.STORAGE_KEY).then(() => {
        this._storageService.store(this.STORAGE_KEY, JSON.stringify(this.selecteds));
      });
    }
  }

  private _restore() {
    this._storageService.fetch(this.STORAGE_KEY).then(json => {
      const cache = JSON.parse(json);
      this.startDate = cache.startDate;
      this.endDate = cache.endDate;
      delete cache.startDate;
      delete cache.endDate;
      this.cache = cache;
    });
  }

  private _encode(params: any): void {
    const multiples = Object.values(params).map(val => Array.isArray(val));
    if (!multiples.includes(true)) {
      const code = Object.keys(params)
        .map(key => [key, params[key]].map(encodeURIComponent).join('='))
        .join('&');
      this.encodedFilters.emit(code);
    }
  }
}
