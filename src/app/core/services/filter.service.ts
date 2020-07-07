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

  requestDepartments(dataProgramadaInicio: number, dataProgramadaTermino: number, agrupamento = 1) {
    const url = `${environment.apiTareffaSpring}/servico/programado/agrupamento/${agrupamento}`;
    const startDate = new Date(dataProgramadaInicio);
    const endDate = new Date(dataProgramadaTermino);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    dataProgramadaInicio = startDate.getTime();
    dataProgramadaTermino = endDate.getTime();
    return this.httpClient.post(
      url,
      { dataProgramadaInicio, dataProgramadaTermino },
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
