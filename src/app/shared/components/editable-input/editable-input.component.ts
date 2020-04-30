import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';

@Component({
  selector: 'app-editable-input',
  templateUrl: './editable-input.component.html',
  styleUrls: ['./editable-input.component.scss']
})
export class EditableInputComponent implements OnInit, OnChanges {
  editing = false;

  @Input() public id = '';
  @Input() public input = '';
  @Input() public placeholder = '';
  @Input() public isScheduleInput = false;

  @Output() public onSetFocus: EventEmitter<any> = new EventEmitter();
  @Output() public onValueChange: EventEmitter<any> = new EventEmitter();
  @Output() public onValueRemoved: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (changes.hasOwnProperty(key)) {
        switch (key) {
          case 'isScheduleInput':
            this.isScheduleInput = changes[key].currentValue;
            if (this.isScheduleInput) {
              this.editing = true;
            }
            break;
        }
      }
    }
  }

  setFocus() {
    this.onSetFocus.emit();
  }

  canEdit() {
    if (this.isScheduleInput) {
      return false;
    } else {
      return true;
    }
  }

  switchAction(value: boolean) {
    this.editing = value;
  }

  changeValue(data) {
    if (this.isScheduleInput) {
      this.input = '';
    }
    this.onValueChange.emit(data);
  }

  clearInput() {
    this.input = '';
  }

  removeValue() {
    this.onValueRemoved.emit();
  }
}
