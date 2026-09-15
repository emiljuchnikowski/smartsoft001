import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import * as paypal from 'paypal-rest-sdk';

import { PaypalConfig, PaypalService } from '@smartsoft001/paypal';

import { paypalProviders } from './paypal-service.example';

/**
 * `PaypalService` talks to PayPal through `paypal-rest-sdk`, not through
 * `HttpService`. Replacing every SDK entry point with a jest mock makes an
 * unexpected call visible; ts-jest hoists this above the imports above.
 */
jest.mock('paypal-rest-sdk', () => ({
  payment: {
    create: jest.fn(),
    execute: jest.fn(),
    get: jest.fn(),
  },
  sale: {
    refund: jest.fn(),
  },
  configure: jest.fn(),
}));

/**
 * The injected `HttpService` is unused by this package today. The stub
 * records and throws anyway, so a future call would fail loudly here.
 */
class RecordingHttpService {
  readonly calls: string[] = [];

  get(url: string): never {
    return this.record('GET', url);
  }

  post(url: string): never {
    return this.record('POST', url);
  }

  private record(method: string, url: string): never {
    this.calls.push(`${method} ${url}`);

    throw new Error('the docs example must not reach the network');
  }
}

describe('docs-examples-node: PaypalPaymentsModule', () => {
  let moduleRef: TestingModule;
  let httpService: RecordingHttpService;

  beforeEach(async () => {
    httpService = new RecordingHttpService();

    moduleRef = await Test.createTestingModule({
      providers: [
        ...paypalProviders,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should resolve the payment service', () => {
    const service: PaypalService = moduleRef.get(PaypalService);

    expect(service).toBeInstanceOf(PaypalService);
  });

  it('should resolve the config with the credentials from the example', () => {
    const config: PaypalConfig = moduleRef.get(PaypalConfig);

    expect(config).toEqual(
      new PaypalConfig(
        'paypal-client-id',
        'paypal-client-secret',
        'PLN',
        'https://app.example.com/orders/thank-you',
        'https://api.example.com/',
        'https://app.example.com/orders/canceled',
        true,
      ),
    );
  });

  it('should make no http call while registering the service', () => {
    moduleRef.get(PaypalService);

    expect(httpService.calls).toEqual([]);
  });

  it('should leave the paypal sdk untouched, including its configure call', () => {
    moduleRef.get(PaypalService);

    expect(paypal.configure as unknown as jest.Mock).not.toHaveBeenCalled();
    expect(
      paypal.payment.create as unknown as jest.Mock,
    ).not.toHaveBeenCalled();
    expect(paypal.payment.get as unknown as jest.Mock).not.toHaveBeenCalled();
    expect(paypal.sale.refund as unknown as jest.Mock).not.toHaveBeenCalled();
  });
});
