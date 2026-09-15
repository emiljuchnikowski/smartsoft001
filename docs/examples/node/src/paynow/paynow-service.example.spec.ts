import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { PaynowConfig, PaynowService } from '@smartsoft001/paynow';

import { paynowProviders } from './paynow-service.example';

/**
 * Every Paynow request goes through `HttpService`. A stub that records and
 * then throws turns any outbound call into a visible failure, so an empty
 * `calls` array proves the example never reached the network.
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

describe('docs-examples-node: PaynowPaymentsModule', () => {
  let moduleRef: TestingModule;
  let httpService: RecordingHttpService;

  beforeEach(async () => {
    httpService = new RecordingHttpService();

    moduleRef = await Test.createTestingModule({
      providers: [
        ...paynowProviders,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should resolve the payment service', () => {
    const service: PaynowService = moduleRef.get(PaynowService);

    expect(service).toBeInstanceOf(PaynowService);
  });

  it('should resolve the config with the credentials from the example', () => {
    const config: PaynowConfig = moduleRef.get(PaynowConfig);

    expect(config).toEqual({
      apiKey: 'paynow-api-key',
      apiSignatureKey: 'paynow-api-signature-key',
      continueUrl: 'https://app.example.com/orders/thank-you',
      test: true,
    });
  });

  it('should make no http call while registering the service', () => {
    moduleRef.get(PaynowService);

    expect(httpService.calls).toEqual([]);
  });
});
