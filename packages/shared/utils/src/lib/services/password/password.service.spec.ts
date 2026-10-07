import { Md5PasswordHasher } from './md5-password.hasher';
import { IPasswordHasher } from './password-hasher';
import { PasswordService } from './password.service';

describe('shared-utils: PasswordService', () => {
  it('should hash', async () => {
    const result = await PasswordService.hash('test');

    expect(result).toBeDefined();
  });

  it('should compare', async () => {
    const password = 'test';
    const hash = await PasswordService.hash(password);

    const result = await PasswordService.compare(password, hash);

    expect(result).toBeTruthy();
  });

  it('keeps the unsalted MD5 digest as the default hash', async () => {
    const result = await PasswordService.hash('secret');

    expect(result).toBe('5ebe2294ecd0e0f08eab7690d2a6ee69');
  });

  it('rejects a wrong password', async () => {
    const result = await PasswordService.compare(
      'wrong',
      '5ebe2294ecd0e0f08eab7690d2a6ee69',
    );

    expect(result).toBe(false);
  });

  it('delegates to the default MD5 hasher', async () => {
    const hasher: IPasswordHasher = new Md5PasswordHasher();

    const [fromService, fromHasher] = await Promise.all([
      PasswordService.hash('secret'),
      hasher.hash('secret'),
    ]);

    expect(fromService).toBe(fromHasher);
    expect(hasher.needsRehash).toBeUndefined();
  });
});
