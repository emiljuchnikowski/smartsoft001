import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ModuleRef } from '@nestjs/core';
import { of } from 'rxjs';

import { Trans } from '@smartsoft001/trans-domain';

import { RevolutService } from './revolut.service';
import { RevolutConfig } from './revolut.config';

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
          public_id: 'test-order-id',
          id: 'test-internal-id',
          state: 'PENDING',
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
        orderId: 'test-order-id',
        responseData: mockResponse.data,
      });
    });

    it('should use sandbox URL when test mode is enabled', async () => {
      const mockResponse = {
        data: {
          public_id: 'test-order-id',
          id: 'test-internal-id',
          state: 'PENDING',
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
        'https://sandbox-merchant.revolut.com/api/1.0/orders',
        expect.any(Object),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token',
          }),
        }),
      );
    });
  });

  describe('getStatus', () => {
    it('should return the status and data of a payment', async () => {
      const mockResponse = {
        data: {
          id: 'test-internal-id',
          state: 'PROCESSING',
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
    });

    it('should map different states to correct statuses', async () => {
      const testCases = [
        { state: 'PROCESSING', expectedStatus: 'completed' },
        { state: 'CANCELLED', expectedStatus: 'canceled' },
        { state: 'FAILED', expectedStatus: 'canceled' },
        { state: 'PENDING', expectedStatus: 'pending' },
        { state: 'UNKNOWN', expectedStatus: 'UNKNOWN' },
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
