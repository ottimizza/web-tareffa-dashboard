export class Product {
  static Group = class {
    static OTTIMIZZA = 'ottimizza';
    static TAREFFA = 'tareffa';
  };

  id: number;

  name: string;
  description: string;

  appUrl: string;
  imageUrl: string;

  group: string;
}
