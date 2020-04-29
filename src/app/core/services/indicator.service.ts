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

  deleteIndicators(id: number) {
    const url = `${environment.apiTareffaSpring}/indicador/${id}`;

    return this.httpClient.delete(url, {
      headers: this.authenticationService.getAuthorizationHeaders()
    });
  }

  deleteGraph(id: number) {
    const url = `${environment.apiTareffaSpring}/grafico/${id}`;

    return this.httpClient.delete(url, {
      headers: this.authenticationService.getAuthorizationHeaders()
    });
  }

  removeServiceFromGraph(graficoId: number, servicoId: number) {
    const url = `${environment.apiTareffaSpring}/grafico/${graficoId}/servico/${servicoId}`;

    return this.httpClient.delete(url, {
      headers: this.authenticationService.getAuthorizationHeaders()
    });
  }

  removeTagFromGraph(graficoId: number, tagId: number) {
    const url = `${environment.apiTareffaSpring}/grafico/${graficoId}/caracteristica/${tagId}`;

    return this.httpClient.delete(url, {
      headers: this.authenticationService.getAuthorizationHeaders()
    });
  }

  addServiceToGraph(graficoId: number, servicoId: number) {
    const url = `${environment.apiTareffaSpring}/grafico/${graficoId}/servico/${servicoId}`;

    return this.httpClient.post(
      url,
      {},
      { headers: this.authenticationService.getAuthorizationHeaders() }
    );
  }

  addTagToGraph(graficoId: number, tagId: number) {
    const url = `${environment.apiTareffaSpring}/grafico/${graficoId}/caracteristica/${tagId}`;

    return this.httpClient.post(
      url,
      {},
      { headers: this.authenticationService.getAuthorizationHeaders() }
    );
  }

  getServices(id: number, showMissing: boolean = null, description: string = null) {
    let url = `${environment.apiTareffaSpring}/grafico/${id}/servico`;

    if (showMissing !== null) {
      url += `/faltantes`;
    }
    if (description !== null) {
      url += `?description=${description}`;
    }

    return this.httpClient.get(url, {
      headers: this.authenticationService.getAuthorizationHeaders()
    });
  }

  getTags(id: number, showMissing: boolean = null) {
    let url = `${environment.apiTareffaSpring}/grafico/${id}/caracteristica`;

    if (showMissing !== null) {
      url += `/faltantes`;
    }

    url += `?description=04`;

    return this.httpClient.get(url, {
      headers: this.authenticationService.getAuthorizationHeaders()
    });
  }

  createGraph(nomeGrafico: string, id: number) {
    const url = `${environment.apiTareffaSpring}/grafico`;

    const obj = {
      nomeGrafico,
      indicador: {
        id
      }
    };

    return this.httpClient.post(url, obj, {
      headers: this.authenticationService.getAuthorizationHeaders()
    });
  }

  updateGraph(id: number, nomeGrafico: string) {
    const url = `${environment.apiTareffaSpring}/grafico/${id}`;

    return this.httpClient.put(
      url,
      { nomeGrafico },
      { headers: this.authenticationService.getAuthorizationHeaders() }
    );
  }

  getGraph(indicatorId: number) {
    const url = `${environment.apiTareffaSpring}/indicador/${indicatorId}/grafico`;

    return this.httpClient.get(url, {
      headers: this.authenticationService.getAuthorizationHeaders()
    });
  }

  getIndicators() {
    const url = `${environment.apiTareffaSpring}/indicador`;
    return this.httpClient.get(url, {
      headers: this.authenticationService.getAuthorizationHeaders()
    });
  }

  getServicoProgramado(filter) {
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

  createIndicators(descricao: string) {
    const url = `${environment.apiTareffaSpring}/indicador`;

    return this.httpClient.post(
      url,
      { descricao },
      { headers: this.authenticationService.getAuthorizationHeaders() }
    );
  }

  updateIndicator(id: number, descricao: string) {
    const url = `${environment.apiTareffaSpring}/indicador/${id}`;

    return this.httpClient.put(
      url,
      { descricao },
      { headers: this.authenticationService.getAuthorizationHeaders() }
    );
  }
}
