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
  MatTooltipModule
} from '@angular/material';
import { CollaboratorListDialogComponent } from './dialogs/collaborator-list/collaborator-list-dialog.component';

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
    MatTooltipModule
  ],
  entryComponents: [CollaboratorListDialogComponent]
})
export class StandartModule {}
