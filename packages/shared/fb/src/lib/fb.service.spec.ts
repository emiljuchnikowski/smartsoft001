import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { FbService } from './fb.service';

const appIds = ['test-app'];
const credentials = { appId: 'test-app', appSecret: 'test-secret' };
const debugUrl =
  'https://graph.facebook.com/debug_token?input_token=test-token&access_token=test-app%7Ctest-secret';
// HMAC-SHA256('test-token', 'test-secret') as hex.
const testProof =
  '4bd72343ca044f8aab1d98f07606cdb1cf47df0c089ff7b5b2df44e40d869970';
const debugResponse = {
  data: { data: { is_valid: true, app_id: 'test-app', user_id: '123456789' } },
};

describe('FbService', () => {
  let service: FbService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FbService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
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
      mockHttpService.get.mockReturnValue(of(debugResponse));

      const result = await service.getUserId(mockToken, appIds, credentials);

      expect(result).toBe('123456789');
      expect(mockHttpService.get).toHaveBeenCalledWith(debugUrl);
    });

    it('should throw error when API call fails', async () => {
      const mockToken = 'invalid-token';
      mockHttpService.get.mockImplementation(() => {
        throw new Error('API Error');
      });

      await expect(
        service.getUserId(mockToken, appIds, credentials),
      ).rejects.toThrow('Invalid Facebook token');
    });
  });

  describe('getData', () => {
    it('should return user data from Facebook API', async () => {
      const mockToken = 'test-token';
      const mockResponse = {
        data: {
          id: '123456789',
          email: 'test@example.com',
        },
      };

      mockHttpService.get
        .mockReturnValueOnce(of(debugResponse))
        .mockReturnValueOnce(of(mockResponse));

      const result = await service.getData(mockToken, appIds, credentials);

      expect(result).toEqual({
        id: '123456789',
        email: 'test@example.com',
      });
      expect(mockHttpService.get).toHaveBeenNthCalledWith(1, debugUrl);
      expect(mockHttpService.get).toHaveBeenNthCalledWith(
        2,
        'https://graph.facebook.com/me?fields=email,id&access_token=' +
          mockToken +
          '&appsecret_proof=' +
          testProof,
      );
    });

    it('should not send appsecret_proof for a token of an app without configured credentials', async () => {
      const mockToken = 'test-token';
      mockHttpService.get
        .mockReturnValueOnce(
          of({
            data: {
              data: { is_valid: true, app_id: 'second-app', user_id: '123' },
            },
          }),
        )
        .mockReturnValueOnce(of({ data: { id: '123', email: 'a@b.c' } }));

      await service.getData(mockToken, ['test-app', 'second-app'], credentials);

      expect(mockHttpService.get).toHaveBeenNthCalledWith(
        2,
        'https://graph.facebook.com/me?fields=email,id&access_token=' +
          mockToken,
      );
    });

    it('should throw error when API call fails', async () => {
      const mockToken = 'invalid-token';
      mockHttpService.get.mockImplementation(() => {
        throw new Error('API Error');
      });

      await expect(
        service.getData(mockToken, appIds, credentials),
      ).rejects.toThrow('Invalid Facebook token');
    });
  });
});
