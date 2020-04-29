import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-editable-input',
  templateUrl: './editable-input.component.html',
  styleUrls: ['./editable-input.component.scss']
})
export class EditableInputComponent implements OnInit {
  editing = false;

  @Input() public id = '';
  @Input() public input = '';
  @Input() public placeholder = '';
  @Input() public isScheduleInput = false;

  @Output() public onFocus: EventEmitter<any> = new EventEmitter();
  @Output() public onValueRemoved: EventEmitter<any> = new EventEmitter();
  @Output() public onValueChange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

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
    this.onValueChange.emit(data);
  }

  clearInput() {
    this.input = '';
  }

  removeValue() {
    this.onValueRemoved.emit();
  }

  setFocus() {
    const a = document.getElementById(this.id);
    console.log(a);
    // this.onFocus.emit();
  }
}
