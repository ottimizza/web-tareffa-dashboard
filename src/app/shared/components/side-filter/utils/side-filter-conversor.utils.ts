import { SelectableFilter } from '@shared/models/Filter';

export class SideFilterConversorUtils {
  public static parse(
    itens: any[],
    title: string,
    id: string,
    multiple?: boolean
  ): SelectableFilter {
    const options = itens.map(item => {
      if (id === 'departamento') {
        return {
          name: item.nomeDepartamento,
          value: JSON.stringify({ nomeDepartamento: item.nomeDepartamento, id: item.id })
        };
      } else if (id === 'servico') {
        return { name: item.nomeServico, value: item.id };
      } else {
        return { name: item.descricao, value: item.id };
      }
    });
    return { id, title, multiple, options };
  }

  public static convertToDashboardRequest(oldFilter: any) {
    const filter: any = {};

    filter.competencia = null;
    filter.dataVencimentoInicio = null;
    filter.dataVencimentoTermino = null;
    filter.empresa = null;
    filter.indicadores = null;
    filter.prazo = null;
    filter.servicosAtivos = null;
    filter.situacao = null;
    filter.tipoBaixa = null;
    filter.usuario = null;

    filter.dataProgramadaInicio = oldFilter?.startDate
      ? new Date(oldFilter.startDate).getTime()
      : null;
    filter.dataProgramadaTermino = oldFilter?.endDate
      ? new Date(oldFilter.endDate).getTime()
      : null;

    filter.caracteristica = oldFilter?.caracteristica
      ? { id: +`${oldFilter.caracteristica}` }
      : null;

    filter.categoria = oldFilter?.categoria ? { id: +`${oldFilter.categoria}` } : null;

    filter.servico =
      oldFilter?.servico && oldFilter.servico.length
        ? oldFilter.servico.map(svc => ({ id: +`${svc}` }))
        : null;

    filter.departamento =
      oldFilter?.departamento && oldFilter.departamento.length
        ? oldFilter.departamento.map(dep => JSON.parse(dep))
        : null;

    return filter;
  }
}
