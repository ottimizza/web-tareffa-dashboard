import { Injectable } from '@angular/core';
import { environment } from '@env';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { HttpClient } from '@angular/common/http';
import { HttpHandlerService } from './http-handler.service';

const FILTER_KEY = 'filter';

@Injectable({ providedIn: 'root' })
export class FilterService {
  constructor(private http: HttpHandlerService) {}

  buildFilter() {}

  getFilters(filterKey: string) {
    return JSON.parse(window.localStorage.getItem(filterKey));
  }

  requestCategorias() {
    const url = `${environment.serviceGetUrl}/categoria`;
    return this.http.get(url, 'Falha ao obter categorias!');
  }

  requestDepartments(dataProgramadaInicio: number, dataProgramadaTermino: number, agrupamento = 1) {
    const url = `${environment.apiTareffaSpring}/servico/programado/agrupamento/${agrupamento}`;
    const startDate = new Date(dataProgramadaInicio);
    const endDate = new Date(dataProgramadaTermino);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    dataProgramadaInicio = startDate.getTime();
    dataProgramadaTermino = endDate.getTime();
    return this.http.post(
      url,
      { dataProgramadaInicio, dataProgramadaTermino },
      'Falha ao obter departamentos!'
    );
  }

  requestIndicators() {
    const url = `${environment.serviceGetUrl}/indicador`;
    return this.http.get(url, 'Falha ao obter indicadores');
  }

  requestCaracteristicas() {
    const url = `${environment.serviceGetUrl}/caracteristicas?description=04`;
    return this.http.get(url, 'Falha ao obter características!');
  }

  store(key: string, f: any) {
    window.localStorage.setItem(key, JSON.stringify(f));
  }

  fromLocalStorage() {
    return JSON.parse(window.localStorage.getItem(FILTER_KEY)) || null;
  }
}
