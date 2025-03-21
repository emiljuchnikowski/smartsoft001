import { Injectable, Logger, Optional } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import {HttpService} from "@nestjs/axios";

import {
  ITransPaymentSingleService,
  Trans,
  TransStatus,
} from "@smartsoft001/trans-domain";

import {
  IRevolutConfigProvider,
  REVOLUT_CONFIG_PROVIDER,
  RevolutConfig,
} from "./revolut.config";

@Injectable()
export class RevolutService implements ITransPaymentSingleService {
  constructor(
    private readonly httpService: HttpService,
    private readonly moduleRef: ModuleRef,
    @Optional() private readonly config: RevolutConfig
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

    const data = {
      amount: obj.amount,
      description: obj.name,
      capture_mode: "AUTOMATIC",
      merchant_order_ext_ref: obj.id,
      customer_email: obj.email,
      currency: "PLN",
    };

    const response = await this.httpService
      .post(this.getBaseUrl(config) + "/api/1.0/orders", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + config.token
        },
        maxRedirects: 0,
      })
      .toPromise();

    return {
      responseData: response.data,
      orderId: response.data["public_id"],
    };
  }

  async getStatus<T>(
    trans: Trans<T>
  ): Promise<{ status: TransStatus; data: any }> {
    const config = await this.getConfig(trans.data);

    const historyItem = trans.history.find(h => h.status === 'started');

    const response = await this.httpService
      .get(this.getBaseUrl(config) + "/api/1.0/orders/" + (historyItem.data as any).responseData.id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + config.token
        },
        maxRedirects: 0,
      })
      .toPromise();

    return {
      data: response.data,
      status: this.getStatusFromExternal(response.data["state"]),
    };
  }

  refund(trans: Trans<any>, comment: string): Promise<any> {
    return Promise.reject('Revolut not support');
  }

  private getBaseUrl(config: RevolutConfig): string {
    if (config.test) return "https://sandbox-merchant.revolut.com";

    return "https://merchant.revolut.com/api";
  }

  private async getConfig(data: any): Promise<RevolutConfig> {
    try {
      const provider: IRevolutConfigProvider = this.moduleRef.get(
        REVOLUT_CONFIG_PROVIDER,
        { strict: false }
      );
      return await provider.get(data);
    } catch (e) {
      Logger.warn("Revolut config provider not found", RevolutService.name);
    }

    return this.config;
  }

  private getStatusFromExternal(status: string): any {
    switch (status) {
      case "PROCESSING":
        return "completed";
      case "CANCELLED":
        return "canceled";
      case "FAILED":
        return "canceled";
      case "PENDING":
        return "pending";
      default:
        return status;
    }
  }
}
