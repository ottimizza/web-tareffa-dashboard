import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireModule } from '@angular/fire';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CoreModule } from '@app/core.module';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { SidebarLayoutComponent } from './layout/sidebar-layout/sidebar-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { HttpClientModule } from '@angular/common/http';
import { AvatarModule } from '@shared/components/avatar/avatar.module';
import { BrandModule } from '@shared/components/brand/brand.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BreadcrumbModule } from '@shared/components/breadcrumb/breadcrumb.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarLayoutModule } from './layout/navbar-layout/navbar-layout.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectFilterModule } from 'mat-select-filter';
import {
  MatButtonModule,
  MatIconModule,
  MatSidenavModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatList,
  MatListModule,
  MatSelectModule,
  MatCheckboxModule,
  MatSnackBarModule
} from '@angular/material';
import { GlobalHttpInterceptor } from '@app/interceptor/http/http.interceptor';
import { GlobalHttpInterceptorProvider } from '@app/interceptor/http/http-interceptor.provider';
import { GlobalErrorHandlerProvider } from '@shared/handlers/global-error-handler.provider';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    ContentLayoutComponent,
    SidebarLayoutComponent
    // NavbarLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,

    HttpClientModule,

    // core & shared
    CoreModule,
    // SharedModule,

    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),

    PipesModule,

    //
    NavbarLayoutModule,

    // Firebase Notification
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),

    // Global Components
    AvatarModule,
    BrandModule,
    BreadcrumbModule,

    // Material
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatListModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSnackBarModule,

    // Custom material based modules
    MatSelectFilterModule
  ],
  providers: [GlobalHttpInterceptorProvider, GlobalErrorHandlerProvider, MatDatepickerModule],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {}
