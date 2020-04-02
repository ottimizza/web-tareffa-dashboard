import { NgModule } from '@angular/core';
import { AuthCallbackComponent } from './page/callback/callback.component';
import { AuthLogoutComponent } from './page/logout/logout.component';
import { AuthRoutingModule } from './auth.routing';

// import { SharedModule } from '@shared/shared.module';

// import { UserDetailsComponent } from './page/user-details/user-details.component';

@NgModule({
  declarations: [
    AuthCallbackComponent,
    AuthLogoutComponent
    // UserDetailsComponent
  ],
  imports: [
    // SharedModule,
    AuthRoutingModule
  ],
  exports: [],
  providers: [],
  entryComponents: []
})
export class AuthModule { }
