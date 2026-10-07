import { TransSystem } from '../entities/trans.entity';

export interface ITransCreate<T> {
  /**
   * Validated (`amount is empty` below `1`) and then ignored: the amount
   * charged is the one `ITransInternalService.create` approves.
   */
  amount: number;
  name: string;
  system: TransSystem;
  firstName: string;
  lastName: string;
  email: string;
  contactPhone: string;
  data: T;
  options: any;
  clientIp: string;
}
