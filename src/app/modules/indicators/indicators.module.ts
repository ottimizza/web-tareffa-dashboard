import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicatorsComponent } from './page/indicators.component';
import { IndicatorsRoutingModule } from './indicators.routing';
import { EditableInputModule } from '@shared/components/editable-input/editable-input.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [IndicatorsComponent],
  imports: [CommonModule, IndicatorsRoutingModule, EditableInputModule, MatCheckboxModule],
  exports: [IndicatorsComponent]
})
export class IndicatorsModule {}
