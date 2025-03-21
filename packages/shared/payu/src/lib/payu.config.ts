export class PayuConfig {
    test?: boolean;
    clientId: string;
    clientSecret: string;
    notifyUrl: string;
    continueUrl: string;
    posId: string;
}

export const PAYU_CONFIG_PROVIDER = "PAYU_CONFIG_PROVIDER";

export abstract class IPayuConfigProvider {
    abstract get(data: any): Promise<PayuConfig>;
}
