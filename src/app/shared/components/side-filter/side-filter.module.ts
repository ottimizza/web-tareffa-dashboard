import { NgModule } from '@angular/core';
import { SideFilterComponent } from './side-filter.component';
import { CommonModule } from '@angular/common';
import {
  MatMenuModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SideFilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatMenuModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  exports: [SideFilterComponent]
})
export class SideFilterModule {}
