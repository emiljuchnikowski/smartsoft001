import { TokenConfig } from '@smartsoft001/auth-domain';

import { AuthShellNestjsCoreModule } from './nestjs.module';

const tokenConfig: TokenConfig = {
  secretOrPrivateKey: 'secret',
  expiredIn: 3600,
  clients: ['test-client'],
};

describe('auth-nestjs: AuthShellNestjsCoreModule', () => {
  it('should register the dynamic module against its own class', () => {
    const dynamicModule = AuthShellNestjsCoreModule.forRoot({ tokenConfig });

    expect(dynamicModule.module).toBe(AuthShellNestjsCoreModule);
  });
});
