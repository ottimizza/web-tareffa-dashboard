import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { environment } from '@env';

@Injectable({ providedIn: 'root' })
export class FunctionAccessService {
  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  verifyFunction(id: string) {
    const url = `${environment.serviceUrl}/funcoes/verify?funcaoId=${id}`;
    const headers = this.authService.getAuthorizationHeaders();
    return this.http.get(url, { headers });
  }
}
