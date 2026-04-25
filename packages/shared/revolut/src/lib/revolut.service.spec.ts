import { HttpService } from '@nestjs/axios';
import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { Trans } from '@smartsoft001/trans-domain';

import { RevolutConfig } from './revolut.config';
import { RevolutService } from './revolut.service';

const mockHttpService = {
  post: jest.fn(),
  get: jest.fn(),
};

const mockModuleRef = {
  get: jest.fn(),
};

const mockRevolutConfig = {
  token: 'mock-token',
  test: true,
};

describe('revolut: RevolutService', () => {
  let service: RevolutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RevolutService,
        { provide: RevolutConfig, useValue: mockRevolutConfig },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ModuleRef, useValue: mockModuleRef },
      ],
    }).compile();

    service = module.get<RevolutService>(RevolutService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a payment and return orderId and responseData', async () => {
      const mockResponse = {
        data: {
          token: 'test-order-token',
          id: 'test-internal-id',
          state: 'pending',
        },
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      const result = await service.create({
        id: 'test-id',
        name: 'test-name',
        amount: 1000,
        email: 'test@example.com',
        clientIp: '127.0.0.1',
        data: {},
      });

      expect(result).toEqual({
        orderId: 'test-order-token',
        responseData: mockResponse.data,
      });
    });

    it('should use sandbox URL and Revolut-Api-Version header when test mode is enabled', async () => {
      const mockResponse = {
        data: {
          token: 'test-order-token',
          id: 'test-internal-id',
          state: 'pending',
        },
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await service.create({
        id: 'test-id',
        name: 'test-name',
        amount: 1000,
        email: 'test@example.com',
        clientIp: '127.0.0.1',
        data: {},
      });

      expect(mockHttpService.post).toHaveBeenCalledWith(
        'https://sandbox-merchant.revolut.com/api/orders',
        expect.any(Object),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token',
            'Revolut-Api-Version': '2024-09-01',
          }),
        }),
      );
    });

    it('should send request body with customer object and correct fields', async () => {
      const mockResponse = {
        data: {
          token: 'test-order-token',
          id: 'test-internal-id',
          state: 'pending',
        },
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await service.create({
        id: 'test-id',
        name: 'test-name',
        amount: 1000,
        email: 'test@example.com',
        firstName: 'Jan',
        lastName: 'Kowalski',
        contactPhone: '+48123',
        clientIp: '127.0.0.1',
        data: {},
      });

      const body = mockHttpService.post.mock.calls[0][1];

      expect(body).toEqual(
        expect.objectContaining({
          amount: 1000,
          currency: 'PLN',
          capture_mode: 'automatic',
          merchant_order_ext_ref: 'test-id',
          description: 'test-name',
        }),
      );
      expect(body.customer).toEqual(
        expect.objectContaining({
          email: 'test@example.com',
          full_name: 'Jan Kowalski',
          phone: '+48123',
        }),
      );
    });
  });

  describe('getStatus', () => {
    it('should return the status and data of a payment', async () => {
      const mockResponse = {
        data: {
          id: 'test-internal-id',
          state: 'completed',
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getStatus({
        data: {},
        history: [
          {
            status: 'started',
            data: { responseData: { id: 'test-internal-id' } },
          },
        ],
      } as Trans<any>);

      expect(result).toEqual({
        status: 'completed',
        data: mockResponse.data,
      });
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://sandbox-merchant.revolut.com/api/orders/test-internal-id',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Revolut-Api-Version': '2024-09-01',
          }),
        }),
      );
    });

    it('should map different states to correct statuses', async () => {
      const testCases = [
        { state: 'pending', expectedStatus: 'pending' },
        { state: 'processing', expectedStatus: 'pending' },
        { state: 'authorised', expectedStatus: 'completed' },
        { state: 'completed', expectedStatus: 'completed' },
        { state: 'cancelled', expectedStatus: 'canceled' },
        { state: 'failed', expectedStatus: 'canceled' },
        { state: 'unknown', expectedStatus: 'unknown' },
      ];

      for (const testCase of testCases) {
        const mockResponse = {
          data: {
            id: 'test-internal-id',
            state: testCase.state,
          },
        };

        mockHttpService.get.mockReturnValue(of(mockResponse));

        const result = await service.getStatus({
          data: {},
          history: [
            {
              status: 'started',
              data: { responseData: { id: 'test-internal-id' } },
            },
          ],
        } as Trans<any>);

        expect(result.status).toBe(testCase.expectedStatus);
      }
    });
  });

  describe('refund', () => {
    it('should reject with "Revolut not support" message', async () => {
      await expect(
        service.refund(
          {
            amount: 1000,
            data: {},
            history: [],
          } as Trans<any>,
          'test comment',
        ),
      ).rejects.toEqual('Revolut does not support refund');
    });
  });
});
