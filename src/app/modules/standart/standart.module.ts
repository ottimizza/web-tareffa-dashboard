import { NgModule } from '@angular/core';
import { StandartComponent } from './page/standart.component';
import { CommonModule } from '@angular/common';
import { SideFilterModule } from '@shared/components/side-filter/side-filter.module';
import { ChartsModule } from 'ng2-charts';
import { StandartRoutingModule } from './standart.routing';
import { DoughnutModule } from '@shared/components/doughnut/doughnut.module';
import {
  MatListModule,
  MatDialogModule,
  MatButtonModule,
  MatTooltipModule,
  MatStepperModule
} from '@angular/material';
import { CollaboratorListDialogComponent } from './dialogs/collaborator-list/collaborator-list-dialog.component';
import { ScrollTrackerModule } from '@shared/directives/scroll-tracker.module';
import { DetailIndicatorModule } from './support/detail-indicator/detail-indicator.module';
import { PipesModule } from '@shared/pipes/pipes.module';

@NgModule({
  declarations: [StandartComponent, CollaboratorListDialogComponent],
  imports: [
    CommonModule,
    SideFilterModule,
    ChartsModule,
    StandartRoutingModule,
    DoughnutModule,
    MatListModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    MatStepperModule,
    ScrollTrackerModule,
    DetailIndicatorModule,
    PipesModule
  ],
  entryComponents: [CollaboratorListDialogComponent]
})
export class StandartModule {}
