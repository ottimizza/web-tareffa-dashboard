import { AnalyticsRoutingModule } from './analytics.routing';
import { AnalyticsComponent } from './page/analytics.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ChartsModule } from 'ng2-charts';
import { SideFilterModule } from '@shared/components/side-filter/side-filter.module';

@NgModule({
  declarations: [AnalyticsComponent],
  imports: [
    CommonModule,
    SlickCarouselModule,
    ChartsModule,
    AnalyticsRoutingModule,
    SideFilterModule
  ]
})
export class AnalyticsModule {}
