import { NgModule } from '@angular/core';
import { CommunicationsComponent } from './page/communications.component';
import { CommonModule } from '@angular/common';
import { CommunicationsRoutingModule } from './communications.routing';
import { DoughnutModule } from '@shared/components/doughnut/doughnut.module';
import { BarChartModule } from '@shared/components/bar-chart/bar-chart.module';

@NgModule({
  declarations: [CommunicationsComponent],
  imports: [CommonModule, CommunicationsRoutingModule, DoughnutModule, BarChartModule]
})
export class CommunicationsModule {}
