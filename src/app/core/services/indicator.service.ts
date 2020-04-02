import { environment } from '@env';
import { AuthenticationService } from './../authentication/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IndicatorService {
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  getIndicators() {
    const url = `${environment.apiTareffaSpring}/indicador`;
    return this.httpClient.get(url, {
      headers: this.authenticationService.getAuthorizationHeaders()
    });
  }
}
