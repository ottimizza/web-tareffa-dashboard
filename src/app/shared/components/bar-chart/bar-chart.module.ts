import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [BarChartComponent],
  imports: [CommonModule, ChartsModule],
  exports: [BarChartComponent]
})
export class BarChartModule {}
