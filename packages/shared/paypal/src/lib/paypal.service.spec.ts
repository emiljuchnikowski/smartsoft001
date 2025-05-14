import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ModuleRef } from '@nestjs/core';
import { Trans } from '@smartsoft001/trans-domain';

import { PaypalService } from './paypal.service';
import { PaypalConfig } from './paypal.config';

// Mock the module before importing it
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
  sdkVersion: '1.8.1',
  userAgent: 'PayPalSDK/PayPal-node-SDK 1.8.1',
}));

//eslint-disable-next-line
import * as paypal from 'paypal-rest-sdk'; // Needs to be mocked first

const mockHttpService = {
  post: jest.fn(),
  get: jest.fn(),
};

const mockModuleRef = {
  get: jest.fn(),
};

const mockPaypalConfig = {
  clientId: 'mock-client-id',
  clientSecret: 'mock-client-secret',
  currencyCode: 'USD',
  apiUrl: 'https://mock.api.url',
  cancelUrl: 'https://mock.cancel.url',
  test: true,
};

describe('paypal: PaypalService', () => {
  let service: PaypalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaypalService,
        { provide: PaypalConfig, useValue: mockPaypalConfig },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ModuleRef, useValue: mockModuleRef },
      ],
    }).compile();

    service = module.get<PaypalService>(PaypalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a payment and return orderId and redirectUrl', async () => {
      const mockPayment = {
        id: 'test-payment-id',
        links: [{ rel: 'approval_url', href: 'https://approval.url' }],
      };

      (paypal.payment.create as jest.Mock).mockImplementation(
        (data, config, callback) => {
          callback(null, mockPayment);
        },
      );

      const result = await service.create({
        id: 'test-id',
        name: 'test-name',
        amount: 1000,
        email: 'test@example.com',
        clientIp: '127.0.0.1',
        data: {},
      });

      expect(result).toEqual({
        orderId: 'test-payment-id',
        redirectUrl: 'https://approval.url',
      });
    });
  });

  describe('confirm', () => {
    it('should execute a payment and return the result', async () => {
      const mockPayment = { id: 'test-payment-id', state: 'approved' };

      (paypal.payment.execute as jest.Mock).mockImplementation(
        (paymentId, data, config, callback) => {
          callback(null, mockPayment);
        },
      );

      const result = await service.confirm(
        'test-payer-id',
        'test-payment-id',
        10,
        {},
      );

      expect(result).toEqual(mockPayment);
    });
  });

  describe('getStatus', () => {
    it('should return the status and data of a payment', async () => {
      const mockPayment = { state: 'COMPLETED' };

      (paypal.payment.get as jest.Mock).mockImplementation(
        (paymentId, config, callback) => {
          callback(null, mockPayment);
        },
      );

      const result = await service.getStatus({
        data: {},
        history: [
          {
            status: 'started',
            data: { orderId: 'test-order-id' },
          },
        ],
      } as Trans<any>);

      expect(result).toEqual({ status: 'completed', data: mockPayment });
    });
  });

  describe('refund', () => {
    it('should process a refund and return the result', async () => {
      const mockRefund = { id: 'test-refund-id', state: 'completed' };

      (paypal.sale.refund as jest.Mock).mockImplementation(
        (saleId, data, config, callback) => {
          callback(null, mockRefund);
        },
      );

      const result = await service.refund(
        {
          amount: 1000,
          data: {},
          history: [
            {
              status: 'completed',
              data: {
                customData: {
                  transactions: [
                    {
                      related_resources: [
                        {
                          sale: { id: 'test-sale-id' },
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        } as Trans<any>,
        'test comment',
      );

      expect(result).toEqual(mockRefund);
    });

    it('should throw an error when transaction ID is not found', async () => {
      await expect(
        service.refund(
          {
            amount: 1000,
            data: {},
            history: [],
          } as unknown as Trans<any>,
          'test comment',
        ),
      ).rejects.toThrow('Paypal transaction ID not found for refund');
    });
  });
});
