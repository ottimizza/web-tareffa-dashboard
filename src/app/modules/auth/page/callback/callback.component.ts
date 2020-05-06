import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { AuthSession } from '@shared/models/AuthSession';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '@env';
import { StorageService } from '@app/services/storage.service';

// import { Project } from '../../../../data/schema/project';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {
  // cria um iframe para o oauth server poder excluir os cookies relacionados
  url = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.oauthBaseUrl}/logout`);

  public callbackCode: string;
  public callbackFinished: boolean;

  constructor(
    public sanitizer: DomSanitizer,
    public router: Router,
    public route: ActivatedRoute,
    public storageService: StorageService,
    public authenticationService: AuthenticationService
  ) {}

  public onLoad() {
    const that = this;
  }

  public ngOnInit() {
    const that = this;
    this.route.queryParamMap.subscribe(queryParams => {
      this.callbackCode = queryParams.get('code');
      if (this.callbackCode) {
        that.authenticationService.exchange(this.callbackCode).subscribe((response: any) => {
          if (response.access_token) {
            AuthSession.fromOAuthResponse(response)
              .store()
              .then(async () => {
                that.callbackFinished = true;

                this.authenticationService.getTareffaUserInfo();

                this.storageService.fetch('redirect_url').then(value => {
                  this.storageService.destroy('redirect_url');
                  if (value) {
                    that.router.navigate([value]);
                  } else {
                    that.router.navigate(['/dashboard']);
                  }
                });

                // const storeUserInfo = that.authenticationService.storeUserInfo();
                // const storeTokenInfo = that.authenticationService.storeTokenInfo();

                // return Promise.all([
                //   storeUserInfo,
                //   storeTokenInfo
                // ]).then((values) => {

                // that.router.navigate(['dashboard']);
                // }).catch((e) => {
                //   console.log(e);
                // });
              });
          }
        });
      }
    });
  }

  pause(value = '') {
    prompt('App Pause', value);
  }
}
