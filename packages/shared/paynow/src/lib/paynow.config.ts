/**
 * Injection token filled by the host application (`useValue` or a subclass);
 * the required fields are therefore definitely assigned, never by a constructor.
 */
export class PaynowConfig {
  test?: boolean;
  apiKey!: string;
  apiSignatureKey!: string;
  continueUrl!: string;
}

export const PAYNOW_CONFIG_PROVIDER = 'PAYNOW_CONFIG_PROVIDER';

export abstract class IPaynowConfigProvider {
  abstract get(data: any): Promise<PaynowConfig>;
}
