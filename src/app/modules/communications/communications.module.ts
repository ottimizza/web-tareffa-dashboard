import { NgModule } from '@angular/core';
import { CommunicationsComponent } from './page/communications.component';
import { CommonModule } from '@angular/common';
import { CommunicationsRoutingModule } from './communications.routing';
import { BarChartModule } from '@shared/components/charts/bar/bar-chart.module';
import { SideFilterModule } from '@shared/components/side-filter/side-filter.module';
import { CommunicationsListModule } from './dialogs/communications-list/communications-list.module';
import { MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { PipesModule } from '@shared/pipes/pipes.module';

@NgModule({
  declarations: [CommunicationsComponent],
  imports: [
    CommonModule,
    CommunicationsRoutingModule,
    BarChartModule,
    SideFilterModule,
    CommunicationsListModule,

    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    PipesModule
  ]
})
export class CommunicationsModule {}
