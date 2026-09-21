import { PaynowConfig, PaynowService } from '@smartsoft001/paynow';
import { RevolutConfig, RevolutService } from '@smartsoft001/revolut';

import {
  TransShellNestjsCoreModule,
  TransShellNestjsModule,
} from './nestjs.module';

// Mock PayPal SDK before importing it
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

const baseConfig = {
  internalApiUrl: 'http://localhost/internal',
  tokenConfig: {
    secretOrPrivateKey: 'secret',
    expiredIn: 3600,
  },
  db: {
    host: 'localhost',
    port: 27017,
    database: 'test',
  },
};

const paynowConfig: PaynowConfig = {
  apiKey: 'api-key',
  apiSignatureKey: 'signature-key',
  continueUrl: 'http://localhost/continue',
};

const revolutConfig: RevolutConfig = {
  token: 'revolut-token',
};

describe('trans-nestjs: TransShellNestjsModule', () => {
  it('should export Paynow config and service when paynow is configured', () => {
    const dynamicModule = TransShellNestjsModule.forRoot({
      ...baseConfig,
      paynowConfig,
    });

    expect(dynamicModule.exports).toEqual(
      expect.arrayContaining([PaynowConfig, PaynowService]),
    );
  });
});

describe('trans-nestjs: TransShellNestjsCoreModule', () => {
  it('should provide Revolut config and service when revolut is configured', () => {
    const dynamicModule = TransShellNestjsCoreModule.forRoot({
      ...baseConfig,
      revolutConfig,
    });

    expect(dynamicModule.providers).toEqual(
      expect.arrayContaining([
        { provide: RevolutConfig, useValue: revolutConfig },
        RevolutService,
      ]),
    );
  });
});
