import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { IItemRepository } from '@smartsoft001/domain-core';

import { RefresherService } from './refresher.service';
import { Trans, TransSystem, TransStatus } from '../entities/trans.entity';
import {
  ITransInternalService,
  ITransPaymentService,
  ITransPaymentSingleService,
} from '../interfaces';

describe('trans-domain: RefresherService', () => {
  let service: RefresherService<any>;
  let mockRepository: jest.Mocked<IItemRepository<Trans<any>>>;
  let mockInternalService: jest.Mocked<ITransInternalService<any>>;
  let mockPaymentService: ITransPaymentService;

  const mockTrans: Trans<any> = {
    id: 'test-id',
    externalId: 'test-external-id',
    name: 'Test Transaction',
    clientIp: '127.0.0.1',
    amount: 100,
    data: { test: 'data' },
    system: 'payu' as TransSystem,
    status: 'pending' as TransStatus,
    history: [],
    modifyDate: new Date(),
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    contactPhone: '123456789',
    options: {},
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      updatePartial: jest.fn(),
      getById: jest.fn(),
      getByCriteria: jest
        .fn()
        .mockResolvedValue({ data: [mockTrans], totalCount: 1 }),
      getAll: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockInternalService = {
      refresh: jest
        .fn()
        .mockResolvedValue({ status: 'completed' as TransStatus }),
    } as any;

    const mockPayuService: ITransPaymentSingleService = {
      create: jest.fn().mockResolvedValue({
        orderId: 'test-order-id',
        redirectUrl: 'http://test.com',
      }),
      getStatus: jest.fn().mockResolvedValue({
        status: 'completed' as TransStatus,
        data: { paymentId: 'test-payment-id' },
      }),
      refund: jest.fn(),
    };

    mockPaymentService = {
      payu: mockPayuService,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefresherService,
        {
          provide: IItemRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RefresherService<any>>(RefresherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('refresh', () => {
    it('should throw NotFoundException when transaction is not found', async () => {
      mockRepository.getByCriteria.mockResolvedValueOnce({
        data: [],
        totalCount: 0,
      });

      await expect(
        service.refresh(
          'non-existent-id',
          mockInternalService,
          mockPaymentService,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should not update transaction when status is unchanged', async () => {
      (mockPaymentService.payu.getStatus as jest.Mock).mockResolvedValueOnce({
        status: 'pending' as TransStatus,
        data: { paymentId: 'test-payment-id' },
      });

      await service.refresh(
        'test-external-id',
        mockInternalService,
        mockPaymentService,
      );

      expect(mockRepository.updatePartial).not.toHaveBeenCalled();
    });

    it('should call updatePartial when status changes', async () => {
      await service.refresh(
        'test-external-id',
        mockInternalService,
        mockPaymentService,
      );

      expect(mockRepository.updatePartial).toHaveBeenCalled();
    });

    it('should throw error when payment service fails', async () => {
      const error = new Error('Test error');
      (mockPaymentService.payu.getStatus as jest.Mock).mockRejectedValueOnce(
        error,
      );

      await expect(
        service.refresh(
          'test-external-id',
          mockInternalService,
          mockPaymentService,
        ),
      ).rejects.toThrow(error);
    });
  });
});
