import { Routes, RouterModule } from '@angular/router';
import { StandartComponent } from './page/standart.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: null, path: '/dashboard/standart' },
    component: StandartComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StandartRoutingModule {}
