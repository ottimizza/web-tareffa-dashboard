import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { IndicatorsComponent } from './page/indicators.component';

const routes: Routes = [
  {
    path: '',
    component: IndicatorsComponent,
    data: { breadcrumb: null, path: '/indicators' },
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicatorsRoutingModule {}
