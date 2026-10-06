import { Trans, TransStatus } from './entities';

export interface ITransInternalService<T> {
  create(trans: Trans<T>): Promise<any>;

  /**
   * @deprecated Never called: `RefresherService` uses `refreshOnce`, and
   * `RefundService` calls no internal method. Move its logic to `refreshOnce`.
   */
  refresh?(trans: Trans<any>): Promise<any>;

  /**
   * Applies the business effect of a status change (fulfil, cancel) exactly
   * once per `idempotencyKey`: deduplicate atomically in durable storage and
   * resolve the same receipt when the key is replayed. A falsy answer leaves
   * the status change unsaved.
   */
  refreshOnce(trans: Trans<any>, idempotencyKey: string): Promise<any>;
}

export interface ITransPaymentService {
  [key: string]: ITransPaymentSingleService;
}

export interface ITransPaymentSingleService {
  create(obj: {
    id: string;
    name: string;
    amount: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    contactPhone?: string;
    clientIp: string;
    data: any;
    options: any;
  }): Promise<{ orderId: string; redirectUrl?: string; responseData?: any }>;

  getStatus<T>(trans: Trans<T>): Promise<{ status: TransStatus; data: any }>;

  refund(trans: Trans<any>, comment: string): Promise<any>;
}
