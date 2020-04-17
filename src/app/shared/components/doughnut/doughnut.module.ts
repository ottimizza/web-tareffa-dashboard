import { NgModule } from '@angular/core';
import { DoughnutComponent } from './doughnut.component';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [DoughnutComponent],
  imports: [CommonModule, ChartsModule],
  exports: [DoughnutComponent]
})
export class DoughnutModule {}
