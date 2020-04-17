import { NgModule } from '@angular/core';
import { StandartComponent } from './page/standart.component';
import { CommonModule } from '@angular/common';
import { SideFilterModule } from '@shared/components/side-filter/side-filter.module';
import { ChartsModule } from 'ng2-charts';
import { StandartRoutingModule } from './standart.routing';
import { DoughnutModule } from '@shared/components/doughnut/doughnut.module';

@NgModule({
  declarations: [StandartComponent],
  imports: [CommonModule, SideFilterModule, ChartsModule, StandartRoutingModule, DoughnutModule]
})
export class StandartModule {}
