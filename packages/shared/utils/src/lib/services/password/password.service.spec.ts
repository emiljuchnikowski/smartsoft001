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
});
