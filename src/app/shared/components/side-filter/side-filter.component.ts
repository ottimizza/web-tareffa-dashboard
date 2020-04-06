import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MatOptionSelectionChange } from '@angular/material';
import { LoggerUtils } from '@shared/utils/logger.utils';

export class SelectableFilter {
  title: string;
  id: string;
  options: { name: string; value: string }[];
}

@Component({
  selector: 'app-side-filter',
  templateUrl: './side-filter.component.html',
  styleUrls: ['./side-filter.component.scss']
})
export class SideFilterComponent implements OnInit {
  @Input() selects: SelectableFilter[];

  @Output() filters: EventEmitter<any> = new EventEmitter();

  opened = false;
  selecteds: any = {};
  names: { id: string; names: string[] }[] = [];

  startDate: string;
  endDate: string;

  ngOnInit(): void {
    this.selects.forEach(sel => {
      if (sel.id.includes(' ')) {
        LoggerUtils.throw(new Error('O ID do select não pode conter espaços'));
      }
      sel.options.forEach(opt => {
        if (opt.value.includes(' ')) {
          LoggerUtils.throw(new Error('O value das opções do select não pode conter espaços'));
        }
      });
    });
  }

  getLabel(id: string) {
    const index = this.names.map(item => item.id).indexOf(id);
    return this.names[index]?.names;
  }

  select(event: MatOptionSelectionChange) {
    this._add(event.source.value.id, event.source.value.value);
    this._addLabel(event.source.value.id, event.source.value.name);
    const object = Object.assign(this.selecteds, {
      startDate: this.startDate ? this.startDate : '',
      endDate: this.endDate ? this.endDate : ''
    });
    this.filters.emit(this.selecteds);
  }

  private _add(id: string, value: string) {
    // const index = this.selecteds.indexOf(object);
    // if (index >= 0) {
    //   this.selecteds.splice(index, 1);
    // } else {
    //   this.selecteds.push(object);
    // }
    if (Object.keys(this.selecteds).includes(id)) {
      const array: string[] = this.selecteds[id];
      if (array.includes(value)) {
        array.splice(array.indexOf(value), 1);
      } else {
        array.push(value);
      }
      this.selecteds[id] = array;
    } else {
      this.selecteds[id] = [value];
    }
  }

  private _addLabel(id: string, name: string) {
    let array = this.names.map(label => label.id);
    const index = array.indexOf(id);
    if (index >= 0) {
      array = this.names[index].names;
      if (array.includes(name)) {
        array.splice(array.indexOf(name), 1);
      } else {
        array.push(name);
      }
      this.names[index].names = array;
    } else {
      this.names.push({ id, names: [name] });
    }
  }
}
