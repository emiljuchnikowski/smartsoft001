import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { PayuConfig, PayuService } from '@smartsoft001/payu';

import { payuProviders } from './payu-service.example';

/**
 * Every PayU request goes through `HttpService`. A stub that records and then
 * throws turns any outbound call into a visible failure, so an empty `calls`
 * array proves the example never reached the network.
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

describe('docs-examples-node: PayuPaymentsModule', () => {
  let moduleRef: TestingModule;
  let httpService: RecordingHttpService;

  beforeEach(async () => {
    httpService = new RecordingHttpService();

    moduleRef = await Test.createTestingModule({
      providers: [
        ...payuProviders,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should resolve the payment service', () => {
    const service: PayuService = moduleRef.get(PayuService);

    expect(service).toBeInstanceOf(PayuService);
  });

  it('should resolve the config with the credentials from the example', () => {
    const config: PayuConfig = moduleRef.get(PayuConfig);

    expect(config).toEqual({
      clientId: 'payu-client-id',
      clientSecret: 'payu-client-secret',
      posId: 'payu-pos-id',
      notifyUrl: 'https://api.example.com/trans/payu/notify',
      continueUrl: 'https://app.example.com/orders/thank-you',
      test: true,
    });
  });

  it('should make no http call while registering the service', () => {
    moduleRef.get(PayuService);

    expect(httpService.calls).toEqual([]);
  });
});
