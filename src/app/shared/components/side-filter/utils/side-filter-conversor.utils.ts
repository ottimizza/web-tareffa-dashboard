import { SelectableFilter } from '@shared/models/Filter';

export class SideFilterConversorUtils {
  public static parse(
    itens: any[],
    title: string,
    id: string,
    multiple?: boolean
  ): SelectableFilter {
    const options = itens.map(item => {
      if (item.descricao && item.id) {
        return { name: item.descricao, value: item.id };
      } else if (item.nomeDepartamento && `${item.id}`) {
        return { name: item.nomeDepartamento, value: `${item.id}` };
      }
    });
    return { id, title, multiple, options };
  }

  public static convertToDashboardRequest(oldFilter: any) {
    const filter: any = {};

    filter.dataProgramadaInicio = oldFilter.startDate
      ? new Date(oldFilter.startDate).getTime()
      : null;
    filter.dataProgramadaTermino = oldFilter.endDate ? new Date(oldFilter.endDate).getTime() : null;
    filter.departamento = oldFilter.departamento?.length
      ? oldFilter.departamento.map(dep => +`${dep}`)
      : null;
    filter.servico = oldFilter.servico ? +`${oldFilter.servico}` : null;
    filter.categoria = oldFilter.categoria ? +`${oldFilter.categoria}` : null;
    filter.caracteristica = oldFilter.caracteristica ? +`${oldFilter.caracteristica}` : null;

    return filter;

    // dataProgramadaInicio
    // dataProgramadaTermino
    // departamento
    // servico
    // categoria
    // caracteristica // Un. de Negócio
  }
}
