import { Injectable, NotFoundException } from '@nestjs/common';

import { IItemRepository } from '@smartsoft001/domain-core';

import { Trans } from '../entities';
import { ITransInternalService, ITransPaymentService } from '../interfaces';
import { TransBaseService } from '../trans.service';

@Injectable()
export class RefundService<T> extends TransBaseService<T> {
  constructor(repository: IItemRepository<Trans<T>>) {
    super(repository);
  }

  async refund(
    transId: string,
    internalService: ITransInternalService<T>,
    paymentService: ITransPaymentService,
    comment = 'Refund',
  ): Promise<void> {
    const trans = await this.repository.getById(transId);

    if (!trans) {
      throw new NotFoundException('Transaction not found: ' + transId);
    }

    if (trans.status !== 'completed') {
      throw new NotFoundException(
        'Transaction is not completed/error: ' + transId,
      );
    }

    try {
      const data = await paymentService[trans.system].refund(trans, comment);

      trans.modifyDate = new Date();
      trans.status = 'refund';
      data['customData'] = {
        comment,
      };
      this.addHistory(trans, data);

      await this.repository.update(trans, null);
    } catch (err) {
      // Provider errors can carry request credentials: never log them raw.
      // setError stores only the error name, a safe message and the status.
      await this.setError(trans, err, 'Transaction refund failed');

      throw err;
    }
  }
}
