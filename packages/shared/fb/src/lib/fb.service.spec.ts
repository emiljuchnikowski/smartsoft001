import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { FbService } from './fb.service';
import { of } from 'rxjs';

describe('FbService', () => {
  let service: FbService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FbService,
        {
          provide: HttpService,
          useValue: mockHttpService
        }
      ],
    }).compile();

    service = module.get<FbService>(FbService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserId', () => {
    it('should return user ID from Facebook API', async () => {
      const mockToken = 'test-token';
      const mockResponse = {
        data: {
          id: '123456789'
        }
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getUserId(mockToken);

      expect(result).toBe('123456789');
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://graph.facebook.com/me?access_token=' + mockToken
      );
    });

    it('should throw error when API call fails', async () => {
      const mockToken = 'invalid-token';
      mockHttpService.get.mockImplementation(() => {
        throw new Error('API Error');
      });

      await expect(service.getUserId(mockToken)).rejects.toThrow('API Error');
    });
  });

  describe('getData', () => {
    it('should return user data from Facebook API', async () => {
      const mockToken = 'test-token';
      const mockResponse = {
        data: {
          id: '123456789',
          email: 'test@example.com'
        }
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getData(mockToken);

      expect(result).toEqual({
        id: '123456789',
        email: 'test@example.com'
      });
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://graph.facebook.com/me?fields=email,id&access_token=' + mockToken
      );
    });

    it('should throw error when API call fails', async () => {
      const mockToken = 'invalid-token';
      mockHttpService.get.mockImplementation(() => {
        throw new Error('API Error');
      });

      await expect(service.getData(mockToken)).rejects.toThrow('API Error');
    });
  });
}); 