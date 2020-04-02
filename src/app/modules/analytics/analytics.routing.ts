import { AnalyticsComponent } from './page/analytics.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: null, path: '/dashboard/analytics' },
    component: AnalyticsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule {}
