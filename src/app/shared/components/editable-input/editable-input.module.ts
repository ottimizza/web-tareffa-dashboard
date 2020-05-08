import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableInputComponent } from './editable-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EditableInputComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [EditableInputComponent],
  entryComponents: [EditableInputComponent]
})
export class EditableInputModule {}
