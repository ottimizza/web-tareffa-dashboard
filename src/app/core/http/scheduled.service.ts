import { Injectable } from '@angular/core';
import { environment } from '@env';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { GenericResponse } from '@shared/models/GenericResponse';
import { Scheduled } from '@shared/models/Scheduled';

const BASE_URL = environment.apiTareffaSpring;

@Injectable({ providedIn: 'root' })
export class ScheduledService {
  constructor(private _http: HttpClient, private _authenticationService: AuthenticationService) {}

  getServicoProgramado(filter: any) {
    const url = `${BASE_URL}/servico/programado`;
    return this._http.post(url, filter, this._headers);
  }

  private get _headers() {
    const headers = this._authenticationService.getAuthorizationHeaders();
    return { headers };
  }
}
