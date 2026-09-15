import { FILE_SERVICE_CONFIG } from '@smartsoft001/angular';
import {
  CrudConfig,
  CrudCoreModule,
  CrudFullConfig,
} from '@smartsoft001/crud-shell-angular';

import { noteCrudConfig } from './crud-config.example';
import { notesCrudFeature, NotesModule } from './crud-module.example';

describe('docs-examples-angular: NotesModule', () => {
  function providerFor(token: unknown): { useValue?: unknown } | undefined {
    const providers = (notesCrudFeature.providers ?? []) as Array<{
      provide?: unknown;
      useValue?: unknown;
    }>;

    return providers.find((provider) => provider.provide === token);
  }

  it('should expose the feature module class', () => {
    expect(NotesModule).toBeDefined();
  });

  it('should resolve to the core module when routing is disabled', () => {
    expect(notesCrudFeature.ngModule).toBe(CrudCoreModule);
  });

  it('should provide the config under CrudConfig', () => {
    expect(providerFor(CrudConfig)?.useValue).toBe(noteCrudConfig);
  });

  it('should provide the same config under CrudFullConfig', () => {
    expect(providerFor(CrudFullConfig)?.useValue).toBe(noteCrudConfig);
  });

  it('should derive the file service api url from the config', () => {
    expect(providerFor(FILE_SERVICE_CONFIG)?.useValue).toEqual({
      apiUrl: noteCrudConfig.apiUrl,
    });
  });
});
