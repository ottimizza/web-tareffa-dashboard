import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';

import { AuthGuard } from '@app/guard/auth.guard';
import { NoAuthGuard } from '@app/guard/no-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'landpage',
    data: {
      breadcrumb: null
    },
    // component: LandPageComponent,
    canActivate: [NoAuthGuard],
    loadChildren: () => import('@modules/land-page/land-page.module').then(m => m.LandPageModule)
  },
  {
    path: 'dashboard',
    data: {
      breadcrumb: 'Dashboard'
    },
    component: ContentLayoutComponent,
    canActivate: [NoAuthGuard], // Should be replaced with actual auth guard
    children: [
      {
        path: '',
        redirectTo: 'default',
        pathMatch: 'full'
      },

      {
        path: 'analytics',
        data: {
          breadcrumb: 'Analítico'
        },
        loadChildren: () =>
          import('@modules/analytics/analytics.module').then(m => m.AnalyticsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'default',
        data: {
          breadcrumb: 'Padrão'
        },
        loadChildren: () => import('@modules/standart/standart.module').then(m => m.StandartModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'indicators',
        data: {
          breadcrumb: 'Indicadores'
        },
        loadChildren: () =>
          import('@modules/indicators/indicators.module').then(m => m.IndicatorsModule),
        canActivate: [AuthGuard]
      }
      // {
      //   path: 'communications',
      //   data: {
      //     breadcrumb: 'Comunicações'
      //   },
      //   loadChildren: () =>
      //     import('@modules/communications/communications.module').then(m => m.CommunicationsModule),
      //   canActivate: [AuthGuard]
      // }
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('@modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    redirectTo: 'dashboard/default',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
