import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, Optional } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import {
  ITransPaymentSingleService,
  Trans,
  TransStatus,
} from '@smartsoft001/trans-domain';

import {
  IRevolutConfigProvider,
  REVOLUT_API_VERSION,
  REVOLUT_CONFIG_PROVIDER,
  RevolutConfig,
} from './revolut.config';

@Injectable()
export class RevolutService implements ITransPaymentSingleService {
  constructor(
    private readonly httpService: HttpService,
    private readonly moduleRef: ModuleRef,
    @Optional() private readonly config: RevolutConfig,
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
  }): Promise<{ orderId: string; responseData: any }> {
    const config = await this.getConfig(obj.data);

    const data: Record<string, any> = {
      amount: obj.amount,
      currency: 'PLN',
      description: obj.name,
      capture_mode: 'automatic',
      merchant_order_ext_ref: obj.id,
    };

    const hasCustomer =
      !!obj.email || !!obj.firstName || !!obj.lastName || !!obj.contactPhone;

    if (hasCustomer) {
      const fullName = [obj.firstName, obj.lastName].filter(Boolean).join(' ');
      data.customer = {
        email: obj.email,
        full_name: fullName || undefined,
        phone: obj.contactPhone,
      };
    }

    const response = await this.httpService
      .post(this.getBaseUrl(config) + '/api/orders', data, {
        headers: this.getHeaders(config),
        maxRedirects: 0,
      })
      .toPromise();

    return {
      responseData: response.data,
      orderId: response.data.token,
    };
  }

  async getStatus<T>(
    trans: Trans<T>,
  ): Promise<{ status: TransStatus; data: any }> {
    const config = await this.getConfig(trans.data);

    const historyItem = trans.history.find((h) => h.status === 'started');

    const response = await this.httpService
      .get(
        this.getBaseUrl(config) +
          '/api/orders/' +
          (historyItem.data as any).responseData.id,
        {
          headers: this.getHeaders(config),
          maxRedirects: 0,
        },
      )
      .toPromise();

    return {
      data: response.data,
      status: this.getStatusFromExternal(response.data['state']),
    };
  }

  refund(trans: Trans<any>, comment: string): Promise<any> {
    return Promise.reject('Revolut does not support refund');
  }

  private getBaseUrl(config: RevolutConfig): string {
    if (config.test) return 'https://sandbox-merchant.revolut.com';

    return 'https://merchant.revolut.com';
  }

  private getHeaders(config: RevolutConfig): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + config.token,
      'Revolut-Api-Version': REVOLUT_API_VERSION,
    };
  }

  private async getConfig(data: any): Promise<RevolutConfig> {
    try {
      const provider: IRevolutConfigProvider = this.moduleRef.get(
        REVOLUT_CONFIG_PROVIDER,
        { strict: false },
      );
      return await provider.get(data);
    } catch (e) {
      Logger.warn('Revolut config provider not found', RevolutService.name);
    }

    return this.config;
  }

  private getStatusFromExternal(status: string): any {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'processing':
        return 'pending';
      case 'authorised':
        return 'completed';
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'canceled';
      case 'failed':
        return 'canceled';
      default:
        return status;
    }
  }
}
