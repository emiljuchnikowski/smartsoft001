import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { GoogleService } from './google.service';

describe('GoogleService', () => {
  let service: GoogleService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<GoogleService>(GoogleService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserId', () => {
    it('should return user ID from Google API', async () => {
      const mockToken = 'test-token';
      const mockResponse = {
        data: {
          user_id: '123456789',
          audience: 'test-client',
          issued_to: 'test-client',
          expires_in: 60,
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getUserId(mockToken, ['test-client']);

      expect(result).toBe('123456789');
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' +
          mockToken,
      );
    });

    it('should throw error when API call fails', async () => {
      const mockToken = 'invalid-token';
      mockHttpService.get.mockImplementation(() => {
        throw new Error('API Error');
      });

      await expect(
        service.getUserId(mockToken, ['test-client']),
      ).rejects.toThrow('Invalid Google token');
    });
  });

  describe('getData', () => {
    it('should return user data from Google API', async () => {
      const mockToken = 'test-token';
      const mockResponse = {
        data: {
          user_id: '123456789',
          audience: 'test-client',
          issued_to: 'test-client',
          expires_in: 60,
          email: 'test@example.com',
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getData(mockToken, ['test-client']);

      expect(result).toEqual({
        id: '123456789',
        email: 'test@example.com',
      });
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' +
          mockToken,
      );
    });

    it('should throw error when API call fails', async () => {
      const mockToken = 'invalid-token';
      mockHttpService.get.mockImplementation(() => {
        throw new Error('API Error');
      });

      await expect(service.getData(mockToken, ['test-client'])).rejects.toThrow(
        'Invalid Google token',
      );
    });
  });
});
