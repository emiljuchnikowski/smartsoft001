import { Test, TestingModule } from '@nestjs/testing';
import { PaynowService } from './paynow.service';
import { HttpService } from '@nestjs/axios';
import { ModuleRef } from '@nestjs/core';
import { of } from 'rxjs';
import { Trans } from '@smartsoft001/trans-domain';
import { PaynowConfig } from './paynow.config';

const mockHttpService = {
  post: jest.fn(),
  get: jest.fn(),
};

const mockModuleRef = {
  get: jest.fn(),
};

const mockPaynowConfig = {
  apiKey: 'mock-api-key',
  apiSignatureKey: 'mock-signature-key',
  continueUrl: 'https://mock.continue.url',
  test: true,
};

describe('PaynowService', () => {
  let service: PaynowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaynowService,
        { provide: PaynowConfig, useValue: mockPaynowConfig }, // Provide mock PaynowConfig
        { provide: HttpService, useValue: mockHttpService },
        { provide: ModuleRef, useValue: mockModuleRef },
      ],
    }).compile();

    service = module.get<PaynowService>(PaynowService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a payment and return orderId and redirectUrl', async () => {
      const mockConfig = { apiKey: 'test-key', apiSignatureKey: 'test-signature', continueUrl: 'https://continue.url', test: true };
      const mockResponse = {
        data: { paymentId: 'test-payment-id', redirectUrl: 'https://redirect.url' },
      };

      mockModuleRef.get.mockReturnValue({
        get: () => Promise.resolve(mockConfig),
      });
      mockHttpService.post.mockReturnValue(of(mockResponse));

      const result = await service.create({
        id: 'test-id',
        name: 'test-name',
        amount: 100,
        email: 'test@example.com',
        clientIp: '127.0.0.1',
        data: {},
      });

      expect(result).toEqual({ orderId: 'test-payment-id', redirectUrl: 'https://redirect.url' });
      expect(mockHttpService.post).toHaveBeenCalledWith(
        'https://api.sandbox.paynow.pl/v1/payments',
        expect.any(Object),
        expect.objectContaining({ headers: expect.any(Object) })
      );
    });
  });

  describe('getStatus', () => {
    it('should return the status and data of a payment', async () => {
      const mockConfig = { apiKey: 'test-key', test: true };
      const mockResponse = {
        data: { status: 'CONFIRMED' },
      };

      mockModuleRef.get.mockReturnValue({
        get: () => Promise.resolve(mockConfig),
      });
      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getStatus({
        data: {},
        history: [{
          status: 'started',
          data: { orderId: 'test-order-id' }
        }]
      } as Trans<any>);

      expect(result).toEqual({ status: 'completed', data: { status: 'CONFIRMED' } });
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.sandbox.paynow.pl/v1/payments/test-order-id/status',
        expect.objectContaining({ headers: expect.any(Object) })
      );
    });
  });

  describe('refund', () => {
    it('should process a refund and return response data', async () => {
      const mockConfig = { apiKey: 'test-key', apiSignatureKey: 'test-signature', test: true };
      const mockResponse = {
        data: { refundId: 'test-refund-id' },
      };

      mockModuleRef.get.mockReturnValue({
        get: () => Promise.resolve(mockConfig),
      });
      mockHttpService.post.mockReturnValue(of(mockResponse));

      const result = await service.refund(
        {
          amount: 100,
          data: {},
          history: [{
            status: 'started',
            data: { orderId: 'test-order-id' }
          }]
        } as Trans<any>,
        'test comment'
      );

      expect(result).toEqual({ refundId: 'test-refund-id' });
      expect(mockHttpService.post).toHaveBeenCalledWith(
        'https://api.sandbox.paynow.pl/v1/payments/test-order-id/refunds',
        expect.any(Object),
        expect.objectContaining({ headers: expect.any(Object) })
      );
    });
  });
});
