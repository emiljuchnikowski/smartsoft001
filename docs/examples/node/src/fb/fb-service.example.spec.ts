import { HttpService } from '@nestjs/axios';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';

import {
  DOCS_FB_APP_ID,
  FacebookAccountsService,
  facebookProviders,
} from './fb-service.example';

interface DebugToken {
  is_valid: boolean;
  app_id: string;
  user_id: string;
}

/**
 * `FbService` reads the `debug_token` answer through `HttpService`, so a stub
 * that returns a canned payload covers the whole call without a socket.
 * `app_id` names the Facebook app the token was issued to and `user_id` the
 * account. Recording the url proves which request the service would have sent.
 */
class RecordingHttpService {
  readonly calls: string[] = [];

  debugToken: DebugToken = {
    is_valid: true,
    app_id: DOCS_FB_APP_ID,
    user_id: '42',
  };

  get(url: string): Observable<{ data: { data: DebugToken } }> {
    this.calls.push(url);

    return of({ data: { data: this.debugToken } });
  }
}

describe('docs-examples-node: FacebookAccountsService', () => {
  let moduleRef: TestingModule;
  let httpService: RecordingHttpService;
  let service: FacebookAccountsService;

  beforeEach(async () => {
    httpService = new RecordingHttpService();

    moduleRef = await Test.createTestingModule({
      providers: [
        ...facebookProviders,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    service = moduleRef.get(FacebookAccountsService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should return the facebook user id for an access token', async () => {
    const result: string = await service.getUserId('token');

    expect(result).toBe('42');
  });

  it('should ask debug_token, with the app access token, about the token', async () => {
    await service.getUserId('token');

    expect(httpService.calls).toEqual([
      'https://graph.facebook.com/debug_token?input_token=token&access_token=1234567890%7Cdocs-app-secret',
    ]);
  });

  it('should reject a token issued to an app outside the allowlist', async () => {
    httpService.debugToken = { ...httpService.debugToken, app_id: '999' };

    await expect(service.getUserId('token')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('should make no http call while registering the service', () => {
    expect(httpService.calls).toEqual([]);
  });
});
