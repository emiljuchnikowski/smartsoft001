import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { throwError } from 'rxjs';

import { PaynowConfig, PaynowService } from '@smartsoft001/paynow';

import { paynowFailureStatus, paynowProviders } from './paynow-service.example';

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

  it('should reject a failed call without the api key, status in the message', async () => {
    const logged = jest
      .spyOn(Logger, 'error')
      .mockImplementation(() => undefined);
    const axiosLike = Object.assign(new Error('Request failed'), {
      config: { headers: { 'Api-Key': 'paynow-api-key' } },
      response: { status: 401, data: {} },
    });
    const failing: TestingModule = await Test.createTestingModule({
      providers: [
        ...paynowProviders,
        {
          provide: HttpService,
          useValue: { post: () => throwError(() => axiosLike) },
        },
      ],
    }).compile();
    const service: PaynowService = failing.get(PaynowService);

    const failure: unknown = await service
      .create({
        id: 'order-1',
        name: 'Order 1',
        amount: 100,
        clientIp: '127.0.0.1',
        data: {},
      })
      .catch((e: unknown) => e);

    expect((failure as Error).message).toBe(
      'Paynow payment creation failed (HTTP 401)',
    );
    expect(failure).not.toHaveProperty('response');
    expect(paynowFailureStatus(failure)).toBe(401);
    expect(JSON.stringify([failure, logged.mock.calls])).not.toContain(
      'paynow-api-key',
    );
    logged.mockRestore();
    await failing.close();
  });

  it('should read no status from a failure Paynow never answered', () => {
    const status = paynowFailureStatus(new Error('Paynow refund failed'));

    expect(status).toBeUndefined();
  });
});
