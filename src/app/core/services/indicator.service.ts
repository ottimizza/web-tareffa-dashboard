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

  getServicoProgramado(filter) {
    console.log(filter);

    const url = `${environment.apiTareffaSpring}/indicador/${filter.indicador}/servico/programado/count`;
    return this.httpClient.post(
      url,
      {
        dataProgramadaInicio: filter.startDate.getTime() || null,
        dataProgramadaTermino: filter.endDate.getTime() || null,
        departamento: filter.departamento || []
      },
      { headers: this.authenticationService.getAuthorizationHeaders() }
    );
  }
}
