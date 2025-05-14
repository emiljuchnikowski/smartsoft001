import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ITransPaymentSingleService,
  Trans,
  TransStatus,
} from '@smartsoft001/trans-domain';
import * as paypal from 'paypal-rest-sdk';

import {
  IPaypalConfigProvider,
  PAYPAL_CONFIG_PROVIDER,
  PaypalConfig,
} from './paypal.config';

@Injectable()
export class PaypalService implements ITransPaymentSingleService {
  constructor(
    private readonly httpService: HttpService,
    private config: PaypalConfig,
    private moduleRef: ModuleRef,
  ) {}

  async create(obj: {
    id: string;
    name: string;
    amount: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    contactPhone?: string;
    clientIp: string;
    data: any;
  }): Promise<{ orderId: string; redirectUrl: string }> {
    const config = await this.getConfig(obj.data);

    const data = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: config.apiUrl + 'paypal/' + obj.id + '/confirm',
        cancel_url: config.cancelUrl,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: obj.name,
                sku: obj.id,
                price: obj.amount / 100,
                currency: config.currencyCode,
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: config.currencyCode,
            total: obj.amount / 100,
          },
          description: obj.name,
        },
      ],
    };

    const result: { id: any; links: any[] } = await new Promise((res, rej) => {
      paypal.payment.create(
        data as any,
        this.getEnv(config) as any,
        (error: any, payment: any) => {
          if (error) {
            rej(error);
          } else {
            res(payment);
          }
        },
      );
    });

    return {
      redirectUrl: result.links.find(
        (l: { rel: string }) => l.rel === 'approval_url',
      ).href,
      orderId: result.id,
    };
  }

  async confirm(
    payerId: any,
    paymentId: any,
    amount: number,
    externalData: any,
  ): Promise<any> {
    const config = await this.getConfig(externalData);

    const data = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: config.currencyCode,
            total: amount,
          },
        },
      ],
    };

    return await new Promise<void>((res, rej) => {
      paypal.payment.execute(
        paymentId,
        data,
        this.getEnv(config) as any,
        (error: any, payment: any) => {
          if (error) {
            rej(error);
          } else {
            res(payment);
          }
        },
      );
    });
  }

  async getStatus<T>(
    trans: Trans<T>,
  ): Promise<{ status: TransStatus; data: any }> {
    const orderId = this.getOrderId(trans) ?? '';
    const config = await this.getConfig(trans.data);

    const payment: { state: string } = await new Promise((res, rej) => {
      paypal.payment.get(
        orderId,
        this.getEnv(config) as any,
        (error: any, result: any) => {
          if (error) {
            rej(error);
          } else {
            res(result);
          }
        },
      );
    });

    return {
      status: this.getStatusFromExternal(payment.state),
      data: payment,
    };
  }

  async refund(trans: Trans<any>, comment: string): Promise<any> {
    const orderId = this.getOrderId(trans);
    const config = await this.getConfig(trans.data);
    const transactionId = this.getTransactionId(trans);

    if (!transactionId) {
      throw new Error('Paypal transaction ID not found for refund');
    }

    const refundData = {
      amount: {
        total: (trans.amount / 100).toString(),
        currency: config.currencyCode,
      },
      description: comment,
    };

    return new Promise((resolve, reject) => {
      paypal.sale.refund(
        transactionId,
        refundData,
        this.getEnv(config) as any,
        (error: any, refund: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(refund);
          }
        },
      );
    });
  }

  private getOrderId(trans: Trans<any>): string | null {
    const historyItem = trans.history.find((x) => x.status === 'started');

    if (!historyItem) {
      console.warn('Transaction without start status');
      return null;
    }

    return historyItem.data.orderId;
  }

  private getStatusFromExternal(status: string): any {
    status = status.toUpperCase();

    switch (status) {
      case 'COMPLETED':
        return 'completed';
      case 'VOIDED':
        return 'canceled';
      case 'CREATED':
        return 'pending';
      case 'SAVED':
        return 'pending';
      case 'APPROVED':
        return 'completed';
      default:
        return status;
    }
  }

  private async getConfig(data: any): Promise<PaypalConfig> {
    try {
      const provider: IPaypalConfigProvider = this.moduleRef.get(
        PAYPAL_CONFIG_PROVIDER,
        { strict: false },
      );
      return await provider.get(data);
    } catch (e) {
      Logger.warn('PayPal config provider not found', PaypalService.name);
    }

    return this.config;
  }

  private getEnv(config: PaypalConfig): {
    mode: any;
    client_id: any;
    client_secret: any;
  } {
    return {
      mode: config.test ? 'sandbox' : 'live',
      client_id: config.clientId,
      client_secret: config.clientSecret,
    };
  }

  private getApiUrl(config: PaypalConfig): string {
    return config.test
      ? 'https://api-m.sandbox.paypal.com/'
      : 'https://api-m.paypal.com/';
  }

  private getTransactionId(trans: Trans<any>): string {
    const historyItem = trans.history.find(
      (i) =>
        i.status === 'completed' &&
        i.data &&
        i.data.customData &&
        i.data.customData.transactions &&
        i.data.customData.transactions.length &&
        i.data.customData.transactions[0].related_resources &&
        i.data.customData.transactions[0].related_resources.length &&
        i.data.customData.transactions[0].related_resources[0].sale,
    );

    return historyItem
      ? historyItem.data.customData.transactions[0].related_resources[0].sale.id
      : null;
  }
}
