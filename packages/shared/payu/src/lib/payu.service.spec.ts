import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ModuleRef } from '@nestjs/core';
import { of, throwError } from 'rxjs';

import { PayuService } from './payu.service';
import { PayuConfig } from './payu.config';

const mockHttpService = {
  post: jest.fn(),
  get: jest.fn(),
};

const mockModuleRef = {
  get: jest.fn(),
};

const mockPayuConfig = {
  posId: 'mock-pos-id',
  clientId: 'mock-client-id',
  clientSecret: 'mock-client-secret',
  notifyUrl: 'https://mock.notify.url',
  continueUrl: 'https://mock.continue.url',
  test: true,
};

describe('payu: PayuService', () => {
  let service: PayuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayuService,
        { provide: PayuConfig, useValue: mockPayuConfig },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ModuleRef, useValue: mockModuleRef },
      ],
    }).compile();

    service = module.get<PayuService>(PayuService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should obtain OAuth token before creating payment', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'mock-token',
        },
      };
      const mockErrorResponse = {
        response: {
          status: 302,
          data: {
            redirectUri: 'https://redirect.url',
            orderId: 'test-order-id',
          },
        },
      };

      mockHttpService.post
        .mockReturnValueOnce(of(mockTokenResponse))
        .mockReturnValueOnce(throwError(() => mockErrorResponse));

      await service.create({
        id: 'test-id',
        name: 'test-name',
        amount: 100,
        email: 'test@example.com',
        clientIp: '127.0.0.1',
        data: {},
      });

      const firstCall = mockHttpService.post.mock.calls[0];
      expect(firstCall[0]).toBe(
        'https://secure.snd.payu.com/pl/standard/user/oauth/authorize',
      );
      expect(firstCall[1]).toBe(
        'grant_type=client_credentials&client_id=mock-client-id&client_secret=mock-client-secret',
      );
    });

    it('should create payment with correct request body', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'mock-token',
        },
      };
      const mockErrorResponse = {
        response: {
          status: 302,
          data: {
            redirectUri: 'https://redirect.url',
            orderId: 'test-order-id',
          },
        },
      };

      mockHttpService.post
        .mockReturnValueOnce(of(mockTokenResponse))
        .mockReturnValueOnce(throwError(() => mockErrorResponse));

      await service.create({
        id: 'test-id',
        name: 'test-name',
        amount: 100,
        email: 'test@example.com',
        clientIp: '127.0.0.1',
        data: {},
      });

      expect(mockHttpService.post.mock.calls[1][1]).toEqual({
        customerIp: '127.0.0.1',
        extOrderId: 'test-id',
        merchantPosId: 'mock-pos-id',
        description: 'test-name',
        currencyCode: 'PLN',
        totalAmount: 100,
        notifyUrl: 'https://mock.notify.url',
        continueUrl: 'https://mock.continue.url',
        products: [
          {
            name: 'test-name',
            unitPrice: 100,
            quantity: '1',
          },
        ],
        buyer: {
          email: 'test@example.com',
        },
      });
    });

    it('should create payment with correct headers', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'mock-token',
        },
      };
      const mockErrorResponse = {
        response: {
          status: 302,
          data: {
            redirectUri: 'https://redirect.url',
            orderId: 'test-order-id',
          },
        },
      };

      mockHttpService.post
        .mockReturnValueOnce(of(mockTokenResponse))
        .mockReturnValueOnce(throwError(() => mockErrorResponse));

      await service.create({
        id: 'test-id',
        name: 'test-name',
        amount: 100,
        email: 'test@example.com',
        clientIp: '127.0.0.1',
        data: {},
      });

      expect(mockHttpService.post.mock.calls[1][2]).toEqual({
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        maxRedirects: 0,
      });
    });

    it('should return redirect URL and order ID on successful payment creation', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'mock-token',
        },
      };
      const mockErrorResponse = {
        response: {
          status: 302,
          data: {
            redirectUri: 'https://redirect.url',
            orderId: 'test-order-id',
          },
        },
      };

      mockHttpService.post
        .mockReturnValueOnce(of(mockTokenResponse))
        .mockReturnValueOnce(throwError(() => mockErrorResponse));

      const result = await service.create({
        id: 'test-id',
        name: 'test-name',
        amount: 100,
        email: 'test@example.com',
        clientIp: '127.0.0.1',
        data: {},
      });

      expect(result).toEqual({
        orderId: 'test-order-id',
        redirectUrl: 'https://redirect.url',
      });
    });
  });

  describe('getStatus', () => {
    it('should obtain OAuth token before checking status', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'mock-token',
        },
      };
      const mockStatusResponse = {
        data: {
          orders: [
            {
              status: 'COMPLETED',
              orderId: 'test-order-id',
            },
          ],
        },
      };

      mockHttpService.post.mockReturnValueOnce(of(mockTokenResponse));
      mockHttpService.get.mockReturnValueOnce(of(mockStatusResponse));

      await service.getStatus({
        data: {},
        history: [
          {
            status: 'started',
            data: { orderId: 'test-order-id' },
          },
        ],
      } as any);

      const firstCall = mockHttpService.post.mock.calls[0];
      expect(firstCall[0]).toBe(
        'https://secure.snd.payu.com/pl/standard/user/oauth/authorize',
      );
      expect(firstCall[1]).toBe(
        'grant_type=client_credentials&client_id=mock-client-id&client_secret=mock-client-secret',
      );
    });

    it('should check status with correct headers', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'mock-token',
        },
      };
      const mockStatusResponse = {
        data: {
          orders: [
            {
              status: 'COMPLETED',
              orderId: 'test-order-id',
            },
          ],
        },
      };

      mockHttpService.post.mockReturnValueOnce(of(mockTokenResponse));
      mockHttpService.get.mockReturnValueOnce(of(mockStatusResponse));

      await service.getStatus({
        data: {},
        history: [
          {
            status: 'started',
            data: { orderId: 'test-order-id' },
          },
        ],
      } as any);

      const getCall = mockHttpService.get.mock.calls[0];
      expect(getCall[1]).toEqual({
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        maxRedirects: 0,
      });
    });

    it('should return correct status and data', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'mock-token',
        },
      };
      const mockStatusResponse = {
        data: {
          orders: [
            {
              status: 'COMPLETED',
              orderId: 'test-order-id',
            },
          ],
        },
      };

      mockHttpService.post.mockReturnValueOnce(of(mockTokenResponse));
      mockHttpService.get.mockReturnValueOnce(of(mockStatusResponse));

      const result = await service.getStatus({
        data: {},
        history: [
          {
            status: 'started',
            data: { orderId: 'test-order-id' },
          },
        ],
      } as any);

      expect(result).toEqual({
        status: 'completed',
        data: {
          status: 'COMPLETED',
          orderId: 'test-order-id',
        },
      });
    });
  });

  describe('refund', () => {
    it('should obtain OAuth token before processing refund', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'mock-token',
        },
      };
      const mockRefundResponse = {
        data: {
          refundId: 'test-refund-id',
        },
      };

      mockHttpService.post
        .mockReturnValueOnce(of(mockTokenResponse))
        .mockReturnValueOnce(of(mockRefundResponse));

      await service.refund(
        {
          data: {},
          history: [
            {
              status: 'started',
              data: { orderId: 'test-order-id' },
            },
          ],
        } as any,
        'test comment',
      );

      const firstCall = mockHttpService.post.mock.calls[0];
      expect(firstCall[0]).toBe(
        'https://secure.snd.payu.com/pl/standard/user/oauth/authorize',
      );
      expect(firstCall[1]).toBe(
        'grant_type=client_credentials&client_id=mock-client-id&client_secret=mock-client-secret',
      );
    });

    it('should process refund with correct request body', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'mock-token',
        },
      };
      const mockRefundResponse = {
        data: {
          refundId: 'test-refund-id',
        },
      };

      mockHttpService.post
        .mockReturnValueOnce(of(mockTokenResponse))
        .mockReturnValueOnce(of(mockRefundResponse));

      await service.refund(
        {
          data: {},
          history: [
            {
              status: 'started',
              data: { orderId: 'test-order-id' },
            },
          ],
        } as any,
        'test comment',
      );

      const secondCall = mockHttpService.post.mock.calls[1];
      expect(secondCall[1]).toEqual({
        refund: {
          description: 'test comment',
        },
      });
    });

    it('should process refund with correct headers', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'mock-token',
        },
      };
      const mockRefundResponse = {
        data: {
          refundId: 'test-refund-id',
        },
      };

      mockHttpService.post
        .mockReturnValueOnce(of(mockTokenResponse))
        .mockReturnValueOnce(of(mockRefundResponse));

      await service.refund(
        {
          data: {},
          history: [
            {
              status: 'started',
              data: { orderId: 'test-order-id' },
            },
          ],
        } as any,
        'test comment',
      );

      const secondCall = mockHttpService.post.mock.calls[1];
      expect(secondCall[2]).toEqual({
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        maxRedirects: 0,
      });
    });

    it('should return refund response data', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'mock-token',
        },
      };
      const mockRefundResponse = {
        data: {
          refundId: 'test-refund-id',
        },
      };

      mockHttpService.post
        .mockReturnValueOnce(of(mockTokenResponse))
        .mockReturnValueOnce(of(mockRefundResponse));

      const result = await service.refund(
        {
          data: {},
          history: [
            {
              status: 'started',
              data: { orderId: 'test-order-id' },
            },
          ],
        } as any,
        'test comment',
      );

      expect(result).toEqual({
        refundId: 'test-refund-id',
      });
    });
  });
});
