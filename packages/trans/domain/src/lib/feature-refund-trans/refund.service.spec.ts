import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { IItemRepository } from '@smartsoft001/domain-core';

import { RefundService } from './refund.service';
import { Trans } from '../entities';
import { ITransInternalService, ITransPaymentService } from '../interfaces';

describe('refund: RefundService', () => {
  let service: RefundService<any>;
  let mockRepository: jest.Mocked<IItemRepository<Trans<any>>>;
  let mockInternalService: jest.Mocked<ITransInternalService<any>>;
  let mockPaymentService: jest.Mocked<ITransPaymentService>;

  beforeEach(async () => {
    mockRepository = {
      getById: jest.fn(),
      update: jest.fn(),
    } as any;

    mockInternalService = {
      refresh: jest.fn(),
    } as any;

    mockPaymentService = {
      payu: {
        refund: jest.fn(),
      },
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefundService,
        {
          provide: IItemRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RefundService<any>>(RefundService);
    jest.spyOn(service as any, 'setError');
  });

  describe('refund', () => {
    it('should throw NotFoundException when transaction is not found', async () => {
      mockRepository.getById.mockResolvedValue(null);

      await expect(
        service.refund(
          'non-existent-id',
          mockInternalService,
          mockPaymentService,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when transaction is not completed', async () => {
      const mockTrans = {
        id: 'test-id',
        status: 'pending',
      } as Trans<any>;

      mockRepository.getById.mockResolvedValue(mockTrans);

      await expect(
        service.refund('test-id', mockInternalService, mockPaymentService),
      ).rejects.toThrow(NotFoundException);
    });

    describe('successful refund flow', () => {
      let mockTrans: Trans<any>;
      let mockRefundData: any;

      beforeEach(() => {
        mockTrans = {
          id: 'test-id',
          status: 'completed',
          system: 'payu',
          modifyDate: new Date(),
          history: [],
        } as Trans<any>;

        mockRefundData = {
          refundId: 'refund-123',
        };

        mockRepository.getById.mockResolvedValue(mockTrans);
        (mockPaymentService.payu.refund as jest.Mock).mockResolvedValue(
          mockRefundData,
        );
        mockRepository.update.mockResolvedValue(undefined);
      });

      it('should update transaction status to refund', async () => {
        await service.refund(
          'test-id',
          mockInternalService,
          mockPaymentService,
          'Test refund',
        );
        expect(mockTrans.status).toBe('refund');
      });

      it('should add refund comment to transaction history', async () => {
        await service.refund(
          'test-id',
          mockInternalService,
          mockPaymentService,
          'Test refund',
        );
        expect(mockTrans.history[0].data.customData).toEqual({
          comment: 'Test refund',
        });
      });

      it('should update transaction in repository', async () => {
        await service.refund(
          'test-id',
          mockInternalService,
          mockPaymentService,
          'Test refund',
        );
        expect(mockRepository.update).toHaveBeenCalledWith(mockTrans, null);
      });
    });

    describe('error handling', () => {
      let mockTrans: Trans<any>;
      let mockError: Error;

      beforeEach(() => {
        mockTrans = {
          id: 'test-id',
          status: 'completed',
          system: 'payu',
          modifyDate: new Date(),
          history: [],
        } as Trans<any>;

        mockError = new Error('Refund failed');

        mockRepository.getById.mockResolvedValue(mockTrans);
        (mockPaymentService.payu.refund as jest.Mock).mockRejectedValue(
          mockError,
        );
      });

      it('should propagate the error', async () => {
        await expect(
          service.refund('test-id', mockInternalService, mockPaymentService),
        ).rejects.toThrow(mockError);
      });

      it('should set transaction status to error', async () => {
        try {
          await service.refund(
            'test-id',
            mockInternalService,
            mockPaymentService,
          );
        } catch (error) {
          expect(mockTrans.status).toBe('error');
        }
      });

      it('should add error to transaction history', async () => {
        const refundPromise = service.refund(
          'test-id',
          mockInternalService,
          mockPaymentService,
        );
        await expect(refundPromise).rejects.toThrow(mockError);
        expect((service as any).setError).toHaveBeenCalledWith(
          mockTrans,
          mockError,
        );
      });

      it('should update transaction in repository', async () => {
        try {
          await service.refund(
            'test-id',
            mockInternalService,
            mockPaymentService,
          );
        } catch (error) {
          expect(mockRepository.update).toHaveBeenCalledWith(mockTrans, null);
        }
      });
    });
  });
});
