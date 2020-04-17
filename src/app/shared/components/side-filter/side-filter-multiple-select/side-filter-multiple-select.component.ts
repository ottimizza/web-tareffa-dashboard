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

  selecteds: string[];
  labels: string[] = [];

  ngOnInit(): void {
    if (this.cache && Object.keys(this.cache).includes(this.item.id)) {
      this.selecteds = this.cache[this.item.id] ?? [];
      // this.item.options.forEach(item => {
      // if (this.selecteds.includes(item.name)) {
      // this.labels.push(item.name);
      // }
      // });
    }

    this._emit();
  }

  select(label: string) {
    const index = this.labels.indexOf(label);
    if (index < 0) {
      this.labels.push(label);
    } else {
      this.labels.splice(index, 1);
    }
    this._emit();
  }

  private async _emit() {
    await this._delay(100);
    this.filter.emit({ id: this.item.id, value: this.selecteds });
  }

  private _delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
