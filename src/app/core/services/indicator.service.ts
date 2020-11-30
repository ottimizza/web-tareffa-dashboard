import { environment } from '@env';
import { Injectable } from '@angular/core';
import { HttpHandlerService } from './http-handler.service';

@Injectable({ providedIn: 'root' })
export class IndicatorService {
  constructor(private http: HttpHandlerService) {}

  deleteIndicators(id: number) {
    const url = `${environment.apiTareffaSpring}/indicador/${id}`;
    return this.http.delete(url, 'Falha ao remover indicador!');
  }

  deleteGraph(id: number) {
    const url = `${environment.apiTareffaSpring}/grafico/${id}`;
    return this.http.delete(url, 'Falha ao remover gráfico!');
  }

  removeServiceFromGraph(graficoId: number, servicoId: number) {
    const url = `${environment.apiTareffaSpring}/grafico/${graficoId}/servico/${servicoId}`;
    return this.http.delete(url, 'Falha ao remover serviço do gráfico!');
  }

  removeTagFromGraph(graficoId: number, tagId: number) {
    const url = `${environment.apiTareffaSpring}/grafico/${graficoId}/caracteristica/${tagId}`;
    return this.http.delete(url, 'Falha ao remover marcador do gráfico!');
  }

  addServiceToGraph(graficoId: number, servicoId: number) {
    const url = `${environment.apiTareffaSpring}/grafico/${graficoId}/servico/${servicoId}`;
    return this.http.post(url, {}, 'Falha ao adicionar serviço ao gráfico');
  }

  addTagToGraph(graficoId: number, tagId: number) {
    const url = `${environment.apiTareffaSpring}/grafico/${graficoId}/caracteristica/${tagId}`;
    return this.http.post(url, {}, 'Falha ao adicionar marcador ao gráfico!');
  }

  getServices(id: number, showMissing: boolean = null, description: string = null) {
    let url = `${environment.serviceGetUrl}/grafico/${id}/servico`;
    if (showMissing !== null) {
      url += `/faltantes`;
    }
    const desc = description !== null ? { description } : {};
    return this.http.get([url, desc], 'Falha ao obter serviços!');
  }

  getTags(id: number, showMissing: boolean = null) {
    let url = `${environment.serviceGetUrl}/grafico/${id}/caracteristica`;
    if (showMissing !== null) {
      url += `/faltantes`;
    }
    const description = { description: '04' };

    return this.http.get([url, description], 'Falha ao obter marcadores!');
  }

  createGraph(nomeGrafico: string, id: number) {
    const url = `${environment.apiTareffaSpring}/grafico`;

    const obj = {
      nomeGrafico,
      indicador: {
        id
      }
    };

    return this.http.post(url, obj, 'Falha ao criar gráfico!');
  }

  updateGraph(id: number, nomeGrafico: string) {
    const url = `${environment.apiTareffaSpring}/grafico/${id}`;
    return this.http.put(url, { nomeGrafico }, 'Falha ao atualizar gráfico');
  }

  getGraph(indicatorId: number) {
    const url = `${environment.serviceGetUrl}/indicador/${indicatorId}/grafico`;
    return this.http.get(url, 'Falha ao obter gráfico!');
  }

  getIndicators() {
    const url = `${environment.serviceGetUrl}/indicador`;
    return this.http.get(url, 'Falha ao obter indicadores!');
  }

  getIndicatorById(indicador) {
    const url = `${environment.serviceGetUrl}/indicador/${indicador}`;
    return this.http.get(url, 'Falha ao obter indicador!');
  }

  getServicoProgramado(filter, indicador?) {
    const url = `${environment.serviceGetUrl}/indicador/${indicador ||
      filter.indicador}/servico/programado/count`;
    const body = {
      dataProgramadaInicio: new Date(filter.startDate).getTime() || null,
      dataProgramadaTermino: new Date(filter.endDate).getTime() || null,
      departamento:
        filter.departamento?.map((dep: unknown) =>
          typeof dep === 'string' ? JSON.parse(dep) : dep
        ) || []
    };
    return this.http.post(url, body, 'Falha ao obter serviço programado!');
  }

  getUsers(filter, indicatorId) {
    const url = `${environment.serviceGetUrl}/grafico/${indicatorId}/usuarios`;
    const body = {
      dataProgramadaInicio: filter.startDate.getTime() || null,
      dataProgramadaTermino: filter.endDate.getTime() || null,
      departamento: filter.departamento
        ? typeof filter.departamento[0] === 'string'
          ? filter.departamento.map(dep => JSON.parse(dep))
          : filter.departamento
        : []
    };
    return this.http.post(url, body, 'Falha ao obter listagem de usuários!');
  }

  createIndicators(descricao: string) {
    const url = `${environment.apiTareffaSpring}/indicador`;
    return this.http.post(url, { descricao }, 'Falha ao criar indicador!');
  }

  updateIndicator(id: number, descricao: string) {
    const url = `${environment.apiTareffaSpring}/indicador/${id}`;
    return this.http.put(url, { descricao }, 'Falha ao atualizar indicador!');
  }
}
