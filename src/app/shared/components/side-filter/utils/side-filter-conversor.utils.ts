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

  public static convertToDashboardRequest(filter: any) {
    if (!filter) {
      filter = {};
    }
    if (filter.startDate) {
      filter.dataProgramadaInicio = filter.startDate;
      delete filter.startDate;
    }
    if (filter.endDate) {
      filter.dataProgramadaTermino = filter.endDate;
      delete filter.endDate;
    }
    if (filter.departamento && filter.departamento.length) {
      filter.departamento = filter.departamento.map(dep => +`${dep}`);
    }
    return filter;
  }
}
