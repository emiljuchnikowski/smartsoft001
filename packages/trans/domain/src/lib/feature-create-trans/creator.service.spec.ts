import { Test, TestingModule } from '@nestjs/testing';

import { IItemRepository } from '@smartsoft001/domain-core';

import { CreatorService } from './creator.service';
import { Trans, TransSystem } from '../entities/trans.entity';
import { ITransCreate } from './interfaces';
import { ITransInternalService, ITransPaymentService } from '../interfaces';

describe('trans-domain: CreatorService', () => {
  let service: CreatorService<any>;
  let mockRepository: jest.Mocked<IItemRepository<Trans<any>>>;
  let mockInternalService: jest.Mocked<ITransInternalService<any>>;
  let mockPaymentService: jest.Mocked<ITransPaymentService>;

  const mockTrans: ITransCreate<any> = {
    name: 'Test Transaction',
    clientIp: '127.0.0.1',
    amount: 100,
    data: { test: 'data' },
    system: 'payu' as TransSystem,
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
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockInternalService = {
      create: jest.fn().mockResolvedValue({ amount: 100 }),
    } as any;

    mockPaymentService = {
      payu: {
        create: jest.fn().mockResolvedValue({
          orderId: 'test-order-id',
          redirectUrl: 'http://test.com',
        }),
      },
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatorService,
        {
          provide: IItemRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CreatorService<any>>(CreatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return correct orderId and redirectUrl', async () => {
      const result = await service.create(
        mockTrans,
        mockInternalService,
        mockPaymentService,
      );

      expect(result).toEqual({
        orderId: 'test-order-id',
        redirectUrl: 'http://test.com',
      });
    });

    it('should call repository create method', async () => {
      await service.create(mockTrans, mockInternalService, mockPaymentService);
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('should call repository update method twice', async () => {
      await service.create(mockTrans, mockInternalService, mockPaymentService);
      expect(mockRepository.update).toHaveBeenCalledTimes(2);
    });

    it('should call internal service create method', async () => {
      await service.create(mockTrans, mockInternalService, mockPaymentService);
      expect(mockInternalService.create).toHaveBeenCalled();
    });

    it('should call payment service create method', async () => {
      await service.create(mockTrans, mockInternalService, mockPaymentService);
      expect(mockPaymentService.payu.create).toHaveBeenCalled();
    });

    it('tests the type of a thrown error', () => {
      const throwTypeError = () => {
        throw new TypeError('A TypeError occurred');
      };
      expect(throwTypeError).toThrow(TypeError);
      expect(throwTypeError).toThrow('A TypeError occurred');
    });

    it('should throw DomainValidationError when config is empty', async () => {
      const asyncFn = async () => {
        await service.create(
          null as any,
          mockInternalService,
          mockPaymentService,
        );
      };

      return expect(asyncFn()).rejects.toThrow(/config is empty/);
    });

    it('should throw DomainValidationError when name is missing', async () => {
      const invalidTrans = { ...mockTrans };
      delete invalidTrans.name;

      const asyncFn = async () => {
        await service.create(
          invalidTrans,
          mockInternalService,
          mockPaymentService,
        );
      };

      return expect(asyncFn()).rejects.toThrow(/name is empty/);
    });

    it('should throw DomainValidationError when clientIp is missing', async () => {
      const invalidTrans = { ...mockTrans };
      delete invalidTrans.clientIp;

      const asyncFn = async () => {
        await service.create(
          invalidTrans,
          mockInternalService,
          mockPaymentService,
        );
      };

      return expect(asyncFn()).rejects.toThrow(/client ip is empty/);
    });

    it('should throw DomainValidationError when amount is missing', async () => {
      const invalidTrans = { ...mockTrans };
      delete invalidTrans.amount;

      const asyncFn = async () => {
        await service.create(
          invalidTrans,
          mockInternalService,
          mockPaymentService,
        );
      };

      return expect(asyncFn()).rejects.toThrow(/amount is empty/);
    });

    it('should throw DomainValidationError when data is missing', async () => {
      const invalidTrans = { ...mockTrans };
      delete invalidTrans.data;

      const asyncFn = async () => {
        await service.create(
          invalidTrans,
          mockInternalService,
          mockPaymentService,
        );
      };

      return expect(asyncFn()).rejects.toThrow(/data is empty/);
    });

    it('should throw DomainValidationError when system is missing', async () => {
      const invalidTrans = { ...mockTrans };
      delete invalidTrans.system;

      const asyncFn = async () => {
        await service.create(
          invalidTrans,
          mockInternalService,
          mockPaymentService,
        );
      };

      return expect(asyncFn()).rejects.toThrow(/system is empty/);
    });

    it('should handle errors during transaction creation', async () => {
      mockInternalService.create.mockRejectedValueOnce(new Error('Test error'));

      await expect(
        service.create(mockTrans, mockInternalService, mockPaymentService),
      ).rejects.toThrow('Test error');
    });
  });

  describe('validation', () => {
    it('should throw DomainValidationError when amount is 0', async () => {
      const invalidTrans = { ...mockTrans, amount: 0 };

      const asyncFn = async () => {
        await service.create(
          invalidTrans,
          mockInternalService,
          mockPaymentService,
        );
      };

      return expect(asyncFn()).rejects.toThrow(/amount is empty/);
    });

    it('should throw DomainValidationError when amount is negative', async () => {
      const invalidTrans = { ...mockTrans, amount: -1 };

      const asyncFn = async () => {
        await service.create(
          invalidTrans,
          mockInternalService,
          mockPaymentService,
        );
      };

      return expect(asyncFn()).rejects.toThrow(/amount is empty/);
    });

    it('should throw DomainValidationError when system is invalid', async () => {
      const invalidTrans = {
        ...mockTrans,
        system: 'invalid-system' as TransSystem,
      };

      const asyncFn = async () => {
        await service.create(
          invalidTrans,
          mockInternalService,
          mockPaymentService,
        );
      };

      return expect(asyncFn()).rejects.toThrow(/system is empty/);
    });
  });
});
