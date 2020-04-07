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

  getFilters(filterKey: string) {
    return JSON.parse(window.localStorage.getItem(filterKey));
  }

  requestCategorias() {
    const url = `${environment.apiTareffaSpring}/categoria`;
    return this.httpClient.get(url, {
      headers: this.authenticationService.getAuthorizationHeaders()
    });
  }

  requestDepartments(key, agrupamento = 1) {
    const url = `${environment.apiTareffaSpring}/servico/programado/agrupamento/${agrupamento}`;
    const filter: Filter = JSON.parse(this.getFilters(key));

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

  store(key: string, f: any) {
    window.localStorage.setItem(key, JSON.stringify(f));
  }

  fromLocalStorage() {
    return JSON.parse(window.localStorage.getItem(FILTER_KEY)) || null;
  }
}
