import { Injectable } from '@angular/core';
import { environment } from '@env';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { HttpClient } from '@angular/common/http';

const FILTER_KEY = 'filter';

@Injectable({ providedIn: 'root' })
export class FilterService {
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  buildFilter() {}

  getFilters(filterKey: string) {
    return JSON.parse(window.localStorage.getItem(filterKey));
  }

  requestCategorias() {
    const url = `${environment.apiTareffaSpring}/categoria`;
    return this.httpClient.get(url, {
      headers: this.authenticationService.getAuthorizationHeaders()
    });
  }

  requestDepartments(agrupamento = 1) {
    const url = `${environment.apiTareffaSpring}/servico/programado/agrupamento/${agrupamento}`;

    return this.httpClient.post(
      url,
      { dataProgramadaInicio: 1583064907949, dataProgramadaTermino: 1585656907949 },
      {
        headers: this.authenticationService.getAuthorizationHeaders()
      }
    );
  }

  requestIndicators() {
    const url = `${environment.apiTareffaSpring}/indicador`;
    return this.httpClient.get(url, {
      headers: this.authenticationService.getAuthorizationHeaders()
    });
  }

  requestCaracteristicas() {
    const url = `${environment.apiTareffaSpring}/caracteristicas?description=04`;
    return this.httpClient.get(url, {
      headers: this.authenticationService.getAuthorizationHeaders()
    });
  }

  store(key: string, f: any) {
    window.localStorage.setItem(key, JSON.stringify(f));
  }

  fromLocalStorage() {
    return JSON.parse(window.localStorage.getItem(FILTER_KEY)) || null;
  }
}
