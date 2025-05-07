import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { GoogleService } from './google.service';
import { of } from 'rxjs';

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
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getUserId(mockToken);

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

      await expect(service.getUserId(mockToken)).rejects.toThrow('API Error');
    });
  });

  describe('getData', () => {
    it('should return user data from Google API', async () => {
      const mockToken = 'test-token';
      const mockResponse = {
        data: {
          user_id: '123456789',
          email: 'test@example.com',
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getData(mockToken);

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

      await expect(service.getData(mockToken)).rejects.toThrow('API Error');
    });
  });
});
