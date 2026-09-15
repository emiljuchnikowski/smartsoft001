import { Test, TestingModule } from '@nestjs/testing';

import { PayuConfig, PayuService } from '@smartsoft001/payu';
import { TransConfig } from '@smartsoft001/trans-domain';
import { TransService } from '@smartsoft001/trans-shell-app-services';

import { PaymentsModule, PaymentsWithPayuModule } from './trans-module.example';

describe('docs-examples-node: PaymentsModule', () => {
  let moduleRef: TestingModule;

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should provide the transaction application service', async () => {
    moduleRef = await Test.createTestingModule({
      imports: [PaymentsModule],
    }).compile();

    const service = moduleRef.get(TransService);

    expect(service).toBeInstanceOf(TransService);
  });

  it('should expose the configuration it was built with', async () => {
    moduleRef = await Test.createTestingModule({
      imports: [PaymentsModule],
    }).compile();

    const config = moduleRef.get(TransConfig);

    expect(config.internalApiUrl).toBe('');
  });

  it('should register no payment provider without a provider config', async () => {
    moduleRef = await Test.createTestingModule({
      imports: [PaymentsModule],
    }).compile();

    expect(() => moduleRef.get(PayuService, { strict: false })).toThrow();
  });

  it('should register the payu service once a payu config is given', async () => {
    moduleRef = await Test.createTestingModule({
      imports: [PaymentsWithPayuModule],
    }).compile();

    const payuService = moduleRef.get(PayuService, { strict: false });

    expect(payuService).toBeInstanceOf(PayuService);
  });

  it('should hand the payu credentials to the payu config provider', async () => {
    moduleRef = await Test.createTestingModule({
      imports: [PaymentsWithPayuModule],
    }).compile();

    const payuConfig = moduleRef.get(PayuConfig, { strict: false });

    expect(payuConfig.posId).toBe('1');
  });

  it('should still provide the transaction service with payu enabled', async () => {
    moduleRef = await Test.createTestingModule({
      imports: [PaymentsWithPayuModule],
    }).compile();

    const service = moduleRef.get(TransService);

    expect(service).toBeInstanceOf(TransService);
  });
});
