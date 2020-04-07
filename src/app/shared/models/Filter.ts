export interface Filter {
  startDate: string;
  endDate: string;
  names: { id: string; names: string[] }[];
}

export class SelectableFilter {
  title: string;
  id: string;
  options: { name: string; value: string }[];
}
