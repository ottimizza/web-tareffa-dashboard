import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicatorsComponent } from './page/indicators.component';
import { IndicatorsRoutingModule } from './indicators.routing';
import { EditableInputModule } from '@shared/components/editable-input/editable-input.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [IndicatorsComponent],
  imports: [
    CommonModule,
    FormsModule,
    IndicatorsRoutingModule,
    EditableInputModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  exports: [IndicatorsComponent]
})
export class IndicatorsModule {}
