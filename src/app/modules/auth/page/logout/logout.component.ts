import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { environment } from '@env';
import { DomSanitizer } from '@angular/platform-browser';

// import { Project } from '../../../../data/schema/project';

@Component({
  selector: 'app-auth-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class AuthLogoutComponent implements OnInit {
  // cria um iframe para o oauth server poder excluir os cookies relacionados
  url = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.oauthBaseUrl}/logout`);

  constructor(
    public sanitizer: DomSanitizer,
    public router: Router,
    public route: ActivatedRoute,
    public authenticationService: AuthenticationService
  ) {}

  public logout() {
    this.authenticationService.clearStorage();
    this.authenticationService.authorize();
  }

  ngOnInit(): void {
    this.logout();
  }

  pause(value = '') {
    prompt('App Pause', value);
  }
}
