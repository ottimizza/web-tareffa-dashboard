import { Organization } from './Organization';
import { Builder, IBuilder } from './Builder';

export interface IInvitation {
  id: number;
  type: number;
  email: string;
  token: string;
  organization?: Organization;
}

export class Invitation implements IInvitation {

  id: number;
  type: number;
  email: string;
  token: string;
  organization?: Organization;

  constructor() {
  }

  static builder() {
    return Builder<Invitation>();
  }

}
