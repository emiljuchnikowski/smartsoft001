import { Injectable, NotFoundException } from "@nestjs/common";

import {IItemRepository} from "@smartsoft001/domain-core";

import { TransBaseService } from "../trans.service";
import { ITransInternalService, ITransPaymentService } from "../interfaces";
import { Trans } from "../entities";


@Injectable()
export class RefresherService<T> extends TransBaseService<T> {
  constructor(repository: IItemRepository<Trans<T>>) {
    super(repository);
  }

  async refresh(
    transId: string,
    internalService: ITransInternalService<T>,
    paymentService: ITransPaymentService,
    customData = {}
  ) : Promise<void> {

    // hack : bad map id
    const trans: Trans<any> = (await this.repository
        .getByCriteria({
          externalId: transId
        })).data[0];

    if (!trans) {
      throw new NotFoundException("Transaction not found: " + transId);
    }

    try {
      const { status, data } = await paymentService[trans.system].getStatus(trans);

      if (status === trans.status) return;

      trans.modifyDate = new Date();
      trans.status = status;
      data['customData'] = customData;
      this.addHistory(trans, data);

      const internalRes = await internalService.refresh(trans);

      if (!internalRes) return;

      this.addHistory(trans, internalRes);

      await this.repository.updatePartial({
        id: trans.id,
        modifyDate: trans.modifyDate,
        status: trans.status,
        history: trans.history
      }, null);
    } catch (err) {
      console.error(err);

      await this.setError(trans, err);

      throw err;
    }
  }
}
