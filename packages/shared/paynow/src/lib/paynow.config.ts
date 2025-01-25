export class PaynowConfig {
    test?: boolean;
    apiKey: string;
    apiSignatureKey: string;
    continueUrl: string;
}

export const PAYNOW_CONFIG_PROVIDER = "PAYNOW_CONFIG_PROVIDER";

export abstract class IPaynowConfigProvider {
    abstract get(data: any): Promise<PaynowConfig>;
}
