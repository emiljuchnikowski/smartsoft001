import { HttpService } from '@nestjs/axios';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';

import {
  DOCS_GOOGLE_CLIENT_ID,
  GoogleAccountsService,
  googleProviders,
} from './google-service.example';

interface TokenInfo {
  user_id: string;
  audience: string;
  issued_to: string;
  expires_in: number;
}

/**
 * `GoogleService` reads the tokeninfo response through `HttpService`, so a
 * stub that returns a canned payload covers the whole call without a socket.
 * The id lives under `user_id`, not `id`, and `audience` / `issued_to` name the
 * OAuth client the token was issued to. Recording the url proves which request
 * the service would have sent.
 */
class RecordingHttpService {
  readonly calls: string[] = [];

  tokenInfo: TokenInfo = {
    user_id: '42',
    audience: DOCS_GOOGLE_CLIENT_ID,
    issued_to: DOCS_GOOGLE_CLIENT_ID,
    expires_in: 3599,
  };

  get(url: string): Observable<{ data: TokenInfo }> {
    this.calls.push(url);

    return of({ data: this.tokenInfo });
  }
}

describe('docs-examples-node: GoogleAccountsService', () => {
  let moduleRef: TestingModule;
  let httpService: RecordingHttpService;
  let service: GoogleAccountsService;

  beforeEach(async () => {
    httpService = new RecordingHttpService();

    moduleRef = await Test.createTestingModule({
      providers: [
        ...googleProviders,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    service = moduleRef.get(GoogleAccountsService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should return the google user id for an access token', async () => {
    const result: string = await service.getUserId('token');

    expect(result).toBe('42');
  });

  it('should ask the tokeninfo endpoint about the token', async () => {
    await service.getUserId('token');

    expect(httpService.calls).toEqual([
      'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=token',
    ]);
  });

  it('should reject a token issued to a client outside the allowlist', async () => {
    httpService.tokenInfo = {
      ...httpService.tokenInfo,
      audience: 'someone-else.apps.googleusercontent.com',
      issued_to: 'someone-else.apps.googleusercontent.com',
    };

    await expect(service.getUserId('token')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('should make no http call while registering the service', () => {
    expect(httpService.calls).toEqual([]);
  });
});
