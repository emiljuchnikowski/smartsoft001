import { CrudShellNestjsCoreModule } from './nestjs.module';

const options = {
  tokenConfig: {
    secretOrPrivateKey: 'secret',
    expiredIn: 3600,
  },
  db: {
    host: 'localhost',
    port: 27017,
    database: 'test',
  },
};

describe('crud-nestjs: CrudShellNestjsCoreModule', () => {
  it('should register the dynamic module against its own class', () => {
    const dynamicModule = CrudShellNestjsCoreModule.forRoot(options);

    expect(dynamicModule.module).toBe(CrudShellNestjsCoreModule);
  });
});
