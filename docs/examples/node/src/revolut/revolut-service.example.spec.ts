import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { RevolutConfig, RevolutService } from '@smartsoft001/revolut';

import { revolutProviders } from './revolut-service.example';

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
});
