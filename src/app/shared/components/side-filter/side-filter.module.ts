import { NgModule } from '@angular/core';
import { SideFilterComponent } from './side-filter.component';
import { CommonModule } from '@angular/common';
import {
  MatMenuModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatIconModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { SideFilterMultipleSelectComponent } from './side-filter-multiple-select/side-filter-multiple-select.component';
import { SideFilterSelectComponent } from './side-filter-select/side-filter-select.component';

@NgModule({
  declarations: [SideFilterSelectComponent, SideFilterMultipleSelectComponent, SideFilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatMenuModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [SideFilterComponent]
})
export class SideFilterModule {}
