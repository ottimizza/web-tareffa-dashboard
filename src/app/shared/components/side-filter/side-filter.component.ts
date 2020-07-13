import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from './providers/format-datepicker';
import { StorageService } from '@app/services/storage.service';
import { SelectableFilter } from '@shared/models/Filter';
import { LoggerUtils } from '@shared/utils/logger.utils';
import { DateUtils } from '@shared/utils/date.utils';

export enum SideFilterInterceptLocation {
  ON_INIT,
  RESTORE,
  EMIT,
  ACTIVE
}

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
  @Input() intercept: {
    place: SideFilterInterceptLocation;
    function: (selects: SelectableFilter[], param?: any) => any | void;
  };

  @Output() filters: EventEmitter<any> = new EventEmitter();
  @Output() paginate: EventEmitter<string> = new EventEmitter();

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

    const that = this;
    this._intercept(this.location.ON_INIT, result => {}, that);

    if (this.STORAGE_KEY) {
      this._restore();
    } else {
      this.thisMonth();
    }
  }

  filterInitiated() {
    return !!this.selects?.length;
  }

  onScrollEnd(event: string) {
    const select = this.selects.filter(sel => sel.id === event)[0];
    if (select.paginable) {
      this.paginate.emit(event);
    }
  }

  getScreenSize(): boolean {
    return screen.width < 768;
  }

  emit() {
    this.startDate.setHours(0, 0, 0, 0);
    this.endDate.setHours(23, 59, 59, 999);
    this.selecteds.startDate = this.startDate;
    this.selecteds.endDate = this.endDate;
    let selecteds = this.selecteds;

    this._intercept(
      this.location.EMIT,
      result => {
        selecteds = result;
      },
      selecteds
    );

    this.filters.emit(selecteds);
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

  activate(filterInitiated = true) {
    if (filterInitiated === false) {
      return;
    }
    this.selects.sort((i1, i2) => (i1.title > i2.title ? 1 : i2.title > i1.title ? -1 : 0));

    this._intercept(
      this.location.ACTIVE,
      result => {
        this.cache = result;
      },
      this.selecteds
    );

    this.opened = !this.opened;
    if (this.opened && this.STORAGE_KEY) {
      this._restore();
    }
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
      if (json && json !== '{}') {
        let cache = JSON.parse(json);

        this._intercept(
          this.location.RESTORE,
          result => {
            cache = result;
          },
          cache
        );

        this.startDate = new Date(cache.startDate);
        this.endDate = new Date(cache.endDate);
        delete cache.startDate;
        delete cache.endDate;
        this.cache = cache;
      } else {
        this._intercept(
          this.location.RESTORE,
          result => {
            this.cache = result;
          },
          {}
        );
        this.thisMonth();
      }
    });
  }

  private _intercept(
    place: SideFilterInterceptLocation,
    callbackFn: (result: any) => void,
    params?: any
  ) {
    if (this.intercept && this.intercept.place === place) {
      callbackFn(this.intercept.function(this.selects, params));
    }
  }

  private get location() {
    return SideFilterInterceptLocation;
  }
}
