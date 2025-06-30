import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ModuleRef } from '@nestjs/core';

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

import { PaypalService } from '@smartsoft001/paypal';
import {
  CreatorService,
  RefresherService,
  RefundService,
  Trans,
  TransConfig,
  TransSystem,
} from '@smartsoft001/trans-domain';
import { PayuService } from '@smartsoft001/payu';
import { RevolutService } from '@smartsoft001/revolut';
import { PaynowService } from '@smartsoft001/paynow';
import { IItemRepository } from '@smartsoft001/domain-core';

import { TransService } from './trans.service';

describe('trans: TransService', () => {
  let service: TransService;
  let mockModuleRef: jest.Mocked<ModuleRef>;
  let mockCreatorService: jest.Mocked<CreatorService<any>>;
  let mockRefresherService: jest.Mocked<RefresherService<any>>;
  let mockRefundService: jest.Mocked<RefundService<any>>;
  let mockHttpService: jest.Mocked<HttpService>;
  let mockConfig: TransConfig;
  let mockRepository: jest.Mocked<IItemRepository<Trans<any>>>;
  let mockPayuService: jest.Mocked<PayuService>;
  let mockPaynowService: jest.Mocked<PaynowService>;
  let mockPaypalService: jest.Mocked<PaypalService>;
  let mockRevolutService: jest.Mocked<RevolutService>;
  let mockInternalService: any;

  beforeEach(async () => {
    mockModuleRef = {
      get: jest.fn(),
    } as any;

    mockCreatorService = {
      create: jest.fn(),
    } as any;

    mockRefresherService = {
      refresh: jest.fn(),
    } as any;

    mockRefundService = {
      refund: jest.fn(),
    } as any;

    mockHttpService = {
      post: jest.fn(),
      put: jest.fn(),
    } as any;

    mockConfig = {
      internalApiUrl: 'http://test-api.com',
    } as any;

    mockRepository = {
      getById: jest.fn(),
    } as any;

    mockPayuService = {
      create: jest.fn(),
      getStatus: jest.fn(),
      refund: jest.fn(),
    } as any;

    mockPaynowService = {
      create: jest.fn(),
      getStatus: jest.fn(),
      refund: jest.fn(),
    } as any;

    mockPaypalService = {
      create: jest.fn(),
      getStatus: jest.fn(),
      refund: jest.fn(),
    } as any;

    mockRevolutService = {
      create: jest.fn(),
      getStatus: jest.fn(),
      refund: jest.fn(),
    } as any;

    mockInternalService = {
      create: jest.fn(),
      refresh: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransService,
        {
          provide: ModuleRef,
          useValue: mockModuleRef,
        },
        {
          provide: CreatorService,
          useValue: mockCreatorService,
        },
        {
          provide: RefresherService,
          useValue: mockRefresherService,
        },
        {
          provide: RefundService,
          useValue: mockRefundService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: TransConfig,
          useValue: mockConfig,
        },
        {
          provide: IItemRepository,
          useValue: mockRepository,
        },
        {
          provide: PayuService,
          useValue: mockPayuService,
        },
        {
          provide: PaynowService,
          useValue: mockPaynowService,
        },
        {
          provide: PaypalService,
          useValue: mockPaypalService,
        },
        {
          provide: RevolutService,
          useValue: mockRevolutService,
        },
      ],
    }).compile();

    service = module.get<TransService>(TransService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call creator service with correct parameters', async () => {
      const mockOps = {
        amount: 100,
        system: 'payu' as TransSystem,
        name: 'Test Transaction',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        contactPhone: '123456789',
        data: {},
        options: {},
        clientIp: '127.0.0.1',
      };
      const mockResult = {
        orderId: 'test-order',
        redirectUrl: 'http://test.com',
      };
      mockCreatorService.create.mockResolvedValue(mockResult);
      mockModuleRef.get.mockReturnValue(mockInternalService);

      const result = await service.create(mockOps);

      expect(result).toEqual(mockResult);
    });
  });

  describe('refresh', () => {
    it('should call refresher service with correct parameters', async () => {
      const transId = 'test-trans-id';
      const mockData = { status: 'completed' };
      mockModuleRef.get.mockReturnValue(mockInternalService);

      await service.refresh(transId, mockData);

      expect(mockRefresherService.refresh).toHaveBeenCalledWith(
        transId,
        mockInternalService,
        expect.any(Object),
        mockData,
      );
    });
  });

  describe('refund', () => {
    it('should call refund service with correct parameters', async () => {
      const transId = 'test-trans-id';
      const comment = 'Test refund';
      mockModuleRef.get.mockReturnValue(mockInternalService);

      await service.refund(transId, comment);

      expect(mockRefundService.refund).toHaveBeenCalledWith(
        transId,
        mockInternalService,
        expect.any(Object),
        comment,
      );
    });
  });

  describe('getById', () => {
    it('should return transaction by id', async () => {
      const mockTrans = { id: 'test-id', status: 'completed' } as Trans<any>;
      mockRepository.getById.mockResolvedValue(mockTrans);

      const result = await service.getById('test-id');

      expect(result).toEqual(mockTrans);
    });
  });

  describe('getInternalService', () => {
    it('should return internal service from module ref when available', () => {
      mockModuleRef.get.mockReturnValue(mockInternalService);

      const result = (service as any).getInternalService();

      expect(result).toBe(mockInternalService);
    });

    it('should return fallback internal service with create method when module ref fails', () => {
      mockModuleRef.get.mockImplementation(() => {
        throw new Error('Service not found');
      });

      const result = (service as any).getInternalService();

      expect(result).toHaveProperty('create');
    });

    it('should return fallback internal service with refresh method when module ref fails', () => {
      mockModuleRef.get.mockImplementation(() => {
        throw new Error('Service not found');
      });

      const result = (service as any).getInternalService();

      expect(result).toHaveProperty('refresh');
    });
  });
});
