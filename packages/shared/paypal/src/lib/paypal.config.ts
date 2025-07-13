export class PaypalConfig {
  constructor(
    public clientId: string,
    public clientSecret: string,
    public currencyCode: string,
    public returnUrl: string,
    public apiUrl: string,
    public cancelUrl: string,
    public test?: boolean,
  ) {}
}

export const PAYPAL_CONFIG_PROVIDER = 'PAYPAL_CONFIG_PROVIDER';

export abstract class IPaypalConfigProvider {
  abstract get(data: any): Promise<PaypalConfig>;
}
