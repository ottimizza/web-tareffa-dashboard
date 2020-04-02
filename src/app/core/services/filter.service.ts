import { Injectable } from '@angular/core';
import { environment } from '@env';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Filter } from '@shared/models/Filter';

const FILTER_KEY = 'filter';

@Injectable({ providedIn: 'root' })
export class FilterService {
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  buildFilter() {}

  getFilters() {
    return window.localStorage.getItem(FILTER_KEY);
  }

  requestCategorias() {
    const url = `${environment.apiTareffaSpring}/categoria`;
    return this.httpClient.get(url, {
      headers: this.authenticationService.getAuthorizationHeaders()
    });
  }

  requestDepartments(agrupamento = 1) {
    const url = `${environment.apiTareffaSpring}/servico/programado/agrupamento/${agrupamento}`;
    const filter: Filter = JSON.parse(this.getFilters());

    return this.httpClient.post(
      url,
      { dataProgramadaInicio: filter.startDate, dataProgramadaTermino: filter.endDate },
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

  store(f: Filter) {
    window.localStorage.setItem(FILTER_KEY, JSON.stringify(f));
  }

  fromLocalStorage() {
    return JSON.parse(window.localStorage.getItem(FILTER_KEY)) || null;
  }
}
