import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommunicationsComponent } from './page/communications.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: null, path: '/dashboard/communications' },
    component: CommunicationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicationsRoutingModule {}
