import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { AuthSession } from '@shared/models/AuthSession';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '@env';
import { StorageService } from '@app/services/storage.service';
import { FunctionAccessService } from '@app/services/function-access.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {
  // cria um iframe para o oauth server poder excluir os cookies relacionados
  url = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.oauthBaseUrl}/logout`);

  public callbackCode: string;

  constructor(
    public sanitizer: DomSanitizer,
    public router: Router,
    public route: ActivatedRoute,
    public storageService: StorageService,
    private functionAccess: FunctionAccessService,
    public authenticationService: AuthenticationService
  ) {}

  public onLoad() {
    const that = this;
  }

  public ngOnInit() {
    this.onLoad();

    this.route.queryParamMap.subscribe(queryParams => {
      this.callbackCode = queryParams.get('code');
      if (this.callbackCode) {
        this.authenticationService.exchange(this.callbackCode).subscribe((response: any) => {
          if (response.access_token) {
            AuthSession.fromOAuthResponse(response)
              .store()
              .then(async () => {
                this.authenticationService.getTareffaUserInfo();

                // check permission
                this.functionAccess.verifyFunction('dashboard-app-access').subscribe(
                  res => {
                    // on success redirect to dashboard app
                    this.storageService.fetch('redirect_url').then(value => {
                      this.storageService.destroy('redirect_url');
                      if (value) {
                        this.router.navigate([value]);
                      } else {
                        this.router.navigate(['/dashboard']);
                      }
                    });
                  },
                  err => {
                    // on error redirect to login
                    alert(
                      'Sua conta não tem acesso à essa aplicação, verifique com seu administrador'
                    );
                    this.logout();
                  }
                );
              });
          }
        });
      }
    });
  }

  pause(value = '') {
    prompt('App Pause', value);
  }

  public logout() {
    this.authenticationService.clearStorage();
    this.authenticationService.authorize();
  }
}
