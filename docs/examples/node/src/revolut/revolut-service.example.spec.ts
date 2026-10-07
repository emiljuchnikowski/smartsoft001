import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { throwError } from 'rxjs';

import { RevolutConfig, RevolutService } from '@smartsoft001/revolut';

import {
  revolutFailureStatus,
  revolutProviders,
} from './revolut-service.example';

/**
 * Every Revolut request goes through `HttpService`. A stub that records and
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

describe('docs-examples-node: RevolutPaymentsModule', () => {
  let moduleRef: TestingModule;
  let httpService: RecordingHttpService;

  beforeEach(async () => {
    httpService = new RecordingHttpService();

    moduleRef = await Test.createTestingModule({
      providers: [
        ...revolutProviders,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should resolve the payment service', () => {
    const service: RevolutService = moduleRef.get(RevolutService);

    expect(service).toBeInstanceOf(RevolutService);
  });

  it('should resolve the config with the credentials from the example', () => {
    const config: RevolutConfig = moduleRef.get(RevolutConfig);

    expect(config).toEqual({
      token: 'revolut-secret-api-key',
      test: true,
    });
  });

  it('should make no http call while registering the service', () => {
    moduleRef.get(RevolutService);

    expect(httpService.calls).toEqual([]);
  });

  it('should resolve the service without a config, which is optional', async () => {
    const withoutConfig: TestingModule = await Test.createTestingModule({
      providers: [
        RevolutService,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    const service: RevolutService = withoutConfig.get(RevolutService);

    expect(service).toBeInstanceOf(RevolutService);
    await withoutConfig.close();
  });

  it('should reject a failed call without the merchant key, status in the message', async () => {
    const logged = jest
      .spyOn(Logger, 'error')
      .mockImplementation(() => undefined);
    const axiosLike = Object.assign(new Error('Request failed'), {
      config: { headers: { Authorization: 'Bearer revolut-secret-api-key' } },
      response: { status: 401, data: {} },
    });
    const failing: TestingModule = await Test.createTestingModule({
      providers: [
        ...revolutProviders,
        {
          provide: HttpService,
          useValue: { post: () => throwError(() => axiosLike) },
        },
      ],
    }).compile();
    const service: RevolutService = failing.get(RevolutService);

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
      'Revolut order creation failed (HTTP 401)',
    );
    expect(failure).not.toHaveProperty('response');
    expect(revolutFailureStatus(failure)).toBe(401);
    expect(JSON.stringify([failure, logged.mock.calls])).not.toContain(
      'revolut-secret-api-key',
    );
    logged.mockRestore();
    await failing.close();
  });

  it('should read no status from a failure Revolut never answered', () => {
    const status = revolutFailureStatus(
      new Error('Revolut status lookup failed'),
    );

    expect(status).toBeUndefined();
  });
});
