import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatOptionSelectionChange } from '@angular/material';

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
export class SideFilterComponent {
  @Input() selects: SelectableFilter[];

  @Output() filters: EventEmitter<any> = new EventEmitter();

  opened = false;
  selecteds: any[] = [];
  names: { id: string; names: string[] }[] = [];

  getObject(id: string, value: string) {
    const obj: any = {};
    obj[id] = value;
    return obj;
  }

  getLabel(id: string) {
    const index = this.names.map(item => item.id).indexOf(id);
    return this.names[index]?.names;
  }

  select(event: MatOptionSelectionChange) {
    const obj = this.getObject(event.source.value.id, event.source.value.value);
    this._add(obj);
    this._addLabel(event.source.value.id, event.source.value.name);
  }

  private _add(object: any) {
    const index = this.selecteds.indexOf(object);
    if (index >= 0) {
      this.selecteds.splice(index, 1);
    } else {
      this.selecteds.push(object);
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
