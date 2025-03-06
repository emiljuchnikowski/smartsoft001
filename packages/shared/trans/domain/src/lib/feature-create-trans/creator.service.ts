import {Injectable} from "@nestjs/common";
import {Guid} from "guid-typescript";

import {DomainValidationError, IItemRepository} from "@smartsoft001/domain-core";

import {
  ITransCreate,
} from "./interfaces";
import { Trans, TRANS_SYSTEMS } from "../entities/trans.entity";
import { TransBaseService } from "../trans.service";
import {ITransInternalService, ITransPaymentService} from "../interfaces";

@Injectable()
export class CreatorService<T> extends TransBaseService<T> {
  constructor(repository: IItemRepository<Trans<T>>) {
    super(repository);
  }

  create(
    config: ITransCreate<T>,
    internalService: ITransInternalService<T>,
    paymentService: ITransPaymentService
  ): Promise<{ orderId: string, redirectUrl?: string, responseData?: any }> {
    this.valid(config);
    let trans = null;

    return this.prepare(config)
      .then(r => {
        trans = r;
        return this.setAsNew(trans, internalService);
      })
      .then(() => {
        return this.setAsStarted(trans, paymentService);
      })
      .catch(e => {
        this.setError(trans, e);
        console.error(e);
        throw e;
      });
  }

  private async setAsStarted(
    trans: Trans<T>,
    paymentService: ITransPaymentService
  ): Promise<{ orderId: string, redirectUrl?: string, responseData?: any }> {
    const paymentResult = await paymentService[trans.system].create({
      id: trans.id,
      name: trans.name,
      amount: trans.amount,
      firstName: trans.firstName,
      lastName: trans.lastName,
      email: trans.email,
      contactPhone: trans.contactPhone,
      clientIp: trans.clientIp,
      data: trans.data,
      options: trans.options
    });
    trans.status = "started";
    trans.modifyDate = new Date();
    trans.externalId = paymentResult.orderId;

    this.addHistory(trans, paymentResult);

    await this.repository.update(trans as any, null);

    return paymentResult;
  }

  private async setAsNew(
    trans: Trans<any & { amount?: number }>,
    internalService: ITransInternalService<T>
  ): Promise<void> {
    const internalResult = await internalService.create(trans);
    if (internalResult.amount) {
      trans.amount = internalResult.amount;
    }
    trans.status = "new";
    trans.modifyDate = new Date();
    this.addHistory(trans, internalResult);

    await this.repository.update(trans as any, null);
  }

  private async prepare(config: ITransCreate<T>): Promise<Trans<T>> {
    const trans = new Trans<T>();

    Object.keys(config).forEach(key => {
      trans[key] = config[key];
    });

    trans.id = Guid.raw();

    trans.modifyDate = new Date();
    trans.status = "prepare";

    this.addHistory(trans, trans.data);

    await this.repository.create(trans as any, null);

    return trans;
  }

  private valid(req: ITransCreate<T>) {
    if (!req) throw new DomainValidationError("config is empty");

    if (!req.name) throw new DomainValidationError("name is empty");
    if (!req.clientIp) throw new DomainValidationError("client ip is empty");
    if (!req.amount || req.amount < 1)
      throw new DomainValidationError("amount is empty");
    if (!req.data) throw new DomainValidationError("data is empty");
    if (!req.system || !TRANS_SYSTEMS.some(s => s === req.system))
      throw new DomainValidationError("system is empty");
  }
}
