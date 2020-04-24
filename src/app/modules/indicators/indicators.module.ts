import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicatorsComponent } from './page/indicators.component';
import { IndicatorsRoutingModule } from './indicators.routing';

@NgModule({
  declarations: [IndicatorsComponent],
  imports: [CommonModule, IndicatorsRoutingModule],
  exports: [IndicatorsComponent]
})
export class IndicatorsModule {}
