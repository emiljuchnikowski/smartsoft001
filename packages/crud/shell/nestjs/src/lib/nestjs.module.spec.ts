import { DynamicModule } from '@nestjs/common';

import { SharedConfig } from '@smartsoft001/nestjs';

import {
  CrudShellNestjsCoreModule,
  CrudShellNestjsModule,
} from './nestjs.module';

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

class Note {
  id!: string;
}

class OtherNote {
  id!: string;
}

function findSharedConfig(dynamicModule: DynamicModule): SharedConfig | null {
  const imports = (dynamicModule.imports ?? []) as Array<any>;

  for (const item of imports) {
    if (!item) {
      continue;
    }

    const provider = Array.isArray(item.providers)
      ? item.providers.find((p: any) => p && p.provide === SharedConfig)
      : null;

    if (provider) {
      return provider.useValue;
    }

    const nested = findSharedConfig(item);

    if (nested) {
      return nested;
    }
  }

  return null;
}

describe('crud-nestjs: CrudShellNestjsCoreModule', () => {
  it('should register the dynamic module against its own class', () => {
    const dynamicModule = CrudShellNestjsCoreModule.forRoot(options);

    expect(dynamicModule.module).toBe(CrudShellNestjsCoreModule);
  });

  it('should propagate the db model type to the shared config', () => {
    const dynamicModule = CrudShellNestjsCoreModule.forRoot({
      ...options,
      db: { ...options.db, type: Note },
    });

    expect(findSharedConfig(dynamicModule)?.type).toBe(Note);
  });
});

describe('crud-nestjs: CrudShellNestjsModule', () => {
  it('should propagate the db model type to the shared config', () => {
    const dynamicModule = CrudShellNestjsModule.forRoot({
      ...options,
      db: { ...options.db, type: Note },
      restApi: false,
      socket: false,
    });

    expect(findSharedConfig(dynamicModule)?.type).toBe(Note);
  });

  it('should prefer the explicit type over the db model type', () => {
    const dynamicModule = CrudShellNestjsModule.forRoot({
      ...options,
      type: OtherNote,
      db: { ...options.db, type: Note },
      restApi: false,
      socket: false,
    });

    expect(findSharedConfig(dynamicModule)?.type).toBe(OtherNote);
  });
});
