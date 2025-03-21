import {
  Inject,
  Injectable,
  Logger,
  Optional,
} from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import {HttpService} from "@nestjs/axios";

import {
  ITransPaymentSingleService,
  Trans,
  TransStatus,
} from "@smartsoft001/trans-domain";

import {
  IPayuConfigProvider,
  PAYU_CONFIG_PROVIDER,
  PayuConfig,
} from "./payu.config";

@Injectable()
export class PayuService implements ITransPaymentSingleService {
  constructor(
    private readonly httpService: HttpService,
    private config: PayuConfig,
    private moduleRef: ModuleRef
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
    options?: any;
  }): Promise<{ orderId: string; redirectUrl: string }> {
    const config = await this.getConfig(obj.data);
    const token = await this.getToken(config);

    const data = {
      customerIp: obj.clientIp,
      extOrderId: obj.id,
      merchantPosId: config.posId,
      description: obj.name,
      currencyCode: "PLN",
      totalAmount: obj.amount,
      notifyUrl: config.notifyUrl,
      continueUrl: config.continueUrl,
      products: [
        {
          name: obj.name,
          unitPrice: obj.amount,
          quantity: "1",
        },
      ],
    };

    if (obj.options && obj.options["payMethod"]) {
      data["payMethods"] = {
        payMethod: obj.options["payMethod"],
      };
    }

    if (obj.contactPhone || obj.email || obj.firstName || obj.lastName) {
      data["buyer"] = {
        email: obj.email,
        phone: obj.contactPhone,
        firstName: obj.firstName,
        lastName: obj.lastName,
      };
    }

    try {
      await this.httpService
        .post(this.getBaseUrl(config) + "/api/v2_1/orders", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            "X-Requested-With": "XMLHttpRequest",
          },
          maxRedirects: 0,
        })
        .toPromise();

      return null;
    } catch (e) {
      if (e.response && e.response.status === 302) {
        return {
          redirectUrl: e.response.data.redirectUri,
          orderId: e.response.data.orderId,
        };
      }
      console.error(e);
      throw e;
    }
  }

  async getStatus<T>(
    trans: Trans<T>
  ): Promise<{ status: TransStatus; data: any }> {
    const orderId = this.getOrderId(trans);
    const config = await this.getConfig(trans.data);

    const token = await this.getToken(config);

    const response = await this.httpService
      .get(this.getBaseUrl(config) + "/api/v2_1/orders/" + orderId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
          "X-Requested-With": "XMLHttpRequest",
        },
        maxRedirects: 0,
      })
      .toPromise();

    if (!response.data.orders) return null;

    const order = response.data.orders[0];

    return {
      status: this.getStatusFromExternal(order.status),
      data: order,
    };
  }

  async refund(trans: Trans<any>, comment: string): Promise<any> {
    const orderId = this.getOrderId(trans);
    const config = await this.getConfig(trans.data);

    const token = await this.getToken(config);

    const response = await this.httpService
      .post(
        this.getBaseUrl(config) + "/api/v2_1/orders/" + orderId,
        {
          refund: {
            description: comment,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            "X-Requested-With": "XMLHttpRequest",
          },
          maxRedirects: 0,
        }
      )
      .toPromise();

    return response.data;
  }

  private getOrderId(trans: Trans<any>): string {
    const historyItem = trans.history.find((x) => x.status === "started");

    if (!historyItem) {
      console.warn("Transaction without start status");
      return null;
    }

    return historyItem.data.orderId;
  }

  private async getToken(config: PayuConfig): Promise<string> {
    try {
      const response = await this.httpService
        .post(
          this.getBaseUrl(config) + "/pl/standard/user/oauth/authorize",
          `grant_type=client_credentials&client_id=${config.clientId}&client_secret=${config.clientSecret}`
        )
        .toPromise();

      return response.data["access_token"];
    } catch (e) {
      console.error({
        url: this.getBaseUrl(config) + "/pl/standard/user/oauth/authorize",
        data: `grant_type=client_credentials&client_id=${config.clientId}&client_secret=${config.clientSecret}`,
        ex: e,
      });

      throw e;
    }
  }

  private async getConfig(data: any): Promise<PayuConfig> {
    try {
      const provider: IPayuConfigProvider = this.moduleRef.get(
        PAYU_CONFIG_PROVIDER,
        { strict: false }
      );
      return await provider.get(data);
    } catch (e) {
      Logger.warn("PayPal config provider not found", PayuService.name);
    }

    return this.config;
  }

  private getBaseUrl(config: PayuConfig): string {
    if (config.test) return "https://secure.snd.payu.com";

    return "https://secure.payu.com";
  }

  private getStatusFromExternal(status: string): any {
    switch (status) {
      case "COMPLETED":
        return "completed";
      case "CANCELED":
        return "canceled";
      case "PENDING":
        return "pending";
      default:
        return status;
    }
  }
}
