import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectableFilter } from '@shared/models/Filter';

@Component({
  selector: 'app-sf-select',
  templateUrl: './side-filter-select.component.html'
})
export class SideFilterSelectComponent implements OnInit {
  @Input() item: SelectableFilter;
  @Input() cache: any;

  @Output() filter: EventEmitter<{ id: string; value: string }> = new EventEmitter();
  @Output() scrollEnd: EventEmitter<string> = new EventEmitter();

  selectedName = '';
  selectedValue: string;

  ngOnInit(): void {
    const verify = this.item.options.filter(opt => opt.value === '');
    if (!verify.length) {
      this.item.options.push({
        name: `Todo(a)s os/as ${this.item.title.toLowerCase()}`,
        value: ''
      });
    }

    if (this.cache && Object.keys(this.cache).includes(this.item.id)) {
      this.selectedValue = this.cache[this.item.id] || '';
      const filteredOptions = this.item.options.filter(opt => opt.value === this.selectedValue)[0];
      this.selectedName = filteredOptions ? filteredOptions.name : '';
      this._emit();
    }
  }

  select(value: string, name: string) {
    this.selectedName = name;
    this.selectedValue = value;
    this._emit();
  }

  private _emit() {
    this.filter.emit({ id: this.item.id, value: this.selectedValue });
  }
}
