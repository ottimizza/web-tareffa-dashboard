import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SelectableFilter } from '@shared/models/Filter';

@Component({
  selector: 'app-sf-multiple',
  templateUrl: './side-filter-multiple-select.component.html'
})
export class SideFilterMultipleSelectComponent implements OnInit {
  @Input() item: SelectableFilter;
  @Input() cache: any;

  @Output() filter: EventEmitter<{ id: string; value: string[] }> = new EventEmitter();

  selecteds: string[] = [];
  labels: string[] = [];

  ngOnInit(): void {
    if (Object.keys(this.cache).includes(this.item.id)) {
      this.selecteds = this.cache[this.item.id] ?? [];
      this.selecteds.forEach(sel => {
        this.item.options.forEach(opt => {
          if (sel === opt.value) {
            this.labels.push(opt.name);
          }
        });
      });
    }

    this._emit();
  }

  select(value: string, label: string) {
    const index = this.selecteds.indexOf(value);
    if (index >= 0) {
      this.selecteds.splice(index, 1);
      this.labels.splice(index, 1);
    } else {
      this.selecteds.push(value);
      this.labels.push(label);
    }
    this._emit();
  }

  private _emit() {
    this.filter.emit({ id: this.item.id, value: this.selecteds });
  }
}
