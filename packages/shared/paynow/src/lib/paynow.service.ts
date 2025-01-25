import {
  Injectable,
  Logger,
} from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import * as CryptoJS from "crypto-js";
import {HttpService} from "@nestjs/axios";

import {
  ITransPaymentSingleService,
  Trans,
  TransStatus,
} from "@smartsoft001/trans-domain";

import {
  IPaynowConfigProvider,
  PAYNOW_CONFIG_PROVIDER,
  PaynowConfig,
} from "./paynow.config";
import {GuidService} from "@smartsoft001/utils";

@Injectable()
export class PaynowService implements ITransPaymentSingleService {
  constructor(
    private readonly httpService: HttpService,
    private config: PaynowConfig,
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

    const data = {
      externalId: obj.id,
      description: obj.name,
      currency: "PLN",
      amount: obj.amount,
      continueUrl: config.continueUrl,
      buyer: {
        email: obj.email
      } as any,
    };

    if (obj.contactPhone || obj.firstName || obj.lastName) {
      data["buyer"] = {
        email: obj.email,
        phone: obj.contactPhone,
        firstName: obj.firstName,
        lastName: obj.lastName,
      };
    }

    const signature = this.getSignature(data, config);

    const response = await this.httpService
        .post(this.getBaseUrl(config) + "/v1/payments", data, {
          headers: {
            "Content-Type": "application/json",
            "Api-Key": config.apiKey,
            "Idempotency-Key": GuidService.create(),
            "Signature": signature
          },
          maxRedirects: 0,
        }).toPromise();

    return {
      redirectUrl: response.data.redirectUrl,
      orderId: response.data.paymentId,
    };
  }

  async getStatus<T>(
    trans: Trans<T>
  ): Promise<{ status: TransStatus; data: any }> {
    const orderId = this.getOrderId(trans);
    const config = await this.getConfig(trans.data);

    const response = await this.httpService
      .get(this.getBaseUrl(config) + "/v1/payments/" + orderId + "/status", {
        headers: {
          "Content-Type": "application/json",
          "Api-Key": config.apiKey,
        }
      })
      .toPromise();

    return {
      status: this.getStatusFromExternal(response.data.status),
      data: response.data,
    };
  }

  async refund(trans: Trans<any>, comment: string): Promise<any> {
    const orderId = this.getOrderId(trans);
    const config = await this.getConfig(trans.data);

    const data = {
      amount: trans.amount
    };

    const signature = this.getSignature(data, config);

    const response = await this.httpService
      .post(
        this.getBaseUrl(config) + "/v1/payments/" + orderId + "/refunds",
          data,
        {
          headers: {
            "Content-Type": "application/json",
            "Api-Key": config.apiKey,
            "Idempotency-Key": GuidService.create(),
            "Signature": signature
          }
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

  private async getConfig(data: any): Promise<PaynowConfig> {
    try {
      const provider: IPaynowConfigProvider = this.moduleRef.get(
        PAYNOW_CONFIG_PROVIDER,
        { strict: false }
      );
      return await provider.get(data);
    } catch (e) {
      Logger.warn("Paynow config provider not found", PaynowService.name);
    }

    return this.config;
  }

  private getBaseUrl(config: PaynowConfig): string {
    if (config.test) return "https://api.sandbox.paynow.pl";

    return "https://api.paynow.pl";
  }

  private getStatusFromExternal(status: string): any {
    switch (status) {
      case "CONFIRMED":
        return "completed";
      case "REJECTED":
        return "canceled";
      case "PENDING":
        return "pending";
      default:
        return status;
    }
  }

  private getSignature(data: any, config: PaynowConfig): string {
    return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(JSON.stringify(data), config.apiSignatureKey));
  }
}
