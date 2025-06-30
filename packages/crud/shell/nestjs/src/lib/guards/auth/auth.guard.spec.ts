import { UnauthorizedException, Logger } from '@nestjs/common';
import { AuthJwtGuard, AuthOrAnonymousJwtGuard } from './auth.guard';

describe('crud-nestjs: AuthJwtGuard', () => {
  let guard: AuthJwtGuard;
  let loggerWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    guard = new AuthJwtGuard();
    loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });

  afterEach(() => {
    loggerWarnSpy.mockRestore();
  });

  it('should return user if no error and user exists', () => {
    const user = { id: 1 };
    expect(guard.handleRequest(null, user, null)).toBe(user);
  });

  it('should throw UnauthorizedException if no user and no error', () => {
    expect(() => guard.handleRequest(null, null, { msg: 'no user' })).toThrow(UnauthorizedException);
  });

  it('should throw error if error is present', () => {
    const error = new Error('fail');
    expect(() => guard.handleRequest(error, null, { msg: 'err' })).toThrow(error);
  });

  it('should log info if no user', () => {
    try {
      guard.handleRequest(null, null, { msg: 'info' });
    } catch {}
    expect(loggerWarnSpy).toHaveBeenCalledWith(JSON.stringify({ msg: 'info' }));
  });
});

describe('crud-nestjs: AuthOrAnonymousJwtGuard', () => {
  let guard: AuthOrAnonymousJwtGuard;

  beforeEach(() => {
    guard = new AuthOrAnonymousJwtGuard();
  });

  it('should return user if user exists', () => {
    const user = { id: 2 };
    expect(guard.handleRequest(null, user, null)).toBe(user);
  });

  it('should return undefined if user is undefined', () => {
    expect(guard.handleRequest(null, undefined, null)).toBeUndefined();
  });
}); 