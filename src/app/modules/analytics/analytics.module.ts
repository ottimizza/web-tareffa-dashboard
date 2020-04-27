import { FormsModule } from '@angular/forms';
import { SideFilterModule } from '@shared/components/side-filter/side-filter.module';
import { AnalyticsRoutingModule } from './analytics.routing';
import { AnalyticsComponent } from './page/analytics.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [AnalyticsComponent],
  imports: [
    CommonModule,
    FormsModule,
    SlickCarouselModule,
    ChartsModule,
    AnalyticsRoutingModule,
    ChartsModule,
    SideFilterModule,
    MatSlideToggleModule
  ]
})
export class AnalyticsModule {}
