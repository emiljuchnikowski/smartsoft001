import { useMemo } from 'react';
import type { ReactNode } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import {
  FileService,
  SmartContext,
  SmartHttpClient,
  useSmart,
} from '@smartsoft001/react';


import { CrudConfig, CrudFullConfig } from './crud.config';
import { CrudContext, CrudContextValue } from './crud.context';
import { CrudService } from './services/crud/crud.service';
import { CrudListGroupService } from './services/list-group/list-group.service';
import { CrudSearchService } from './services/search/search.service';
import { CrudEffects } from './state/crud.effects';
import { CrudFacade } from './state/crud.facade';
import { getReducer } from './state/crud.reducer';
import { CrudStore } from './state/crud.store';

interface CrudFeature {
  store: CrudStore;
  effects: CrudEffects<any>;
}

interface CrudRegistry {
  features: Map<string, CrudFeature>;
  searchService: CrudSearchService;
}

// One registry per application (per `SmartProvider`, whose HTTP client is
// created once), so features with the same entity share their state the way
// the NgRx feature did, while two applications rendered in one process (SSR)
// stay apart.
const registries = new WeakMap<SmartHttpClient, CrudRegistry>();

function getRegistry(http: SmartHttpClient): CrudRegistry {
  let registry = registries.get(http);

  if (!registry) {
    registry = { features: new Map(), searchService: new CrudSearchService() };
    registries.set(http, registry);
  }

  return registry;
}

export interface CrudProviderProps<T extends IEntity<string>> {
  config: CrudConfig<T> | CrudFullConfig<T>;
  /** Replaces the REST client, e.g. with a subclass. */
  service?: CrudService<T>;
  children?: ReactNode;
}

/**
 * Sets up a CRUD feature for its subtree: the service, the store with its
 * effects, the facade and the file service pointed at the resource, what
 * `CrudModule.forFeature` provided in Angular. Pass a memoised `config`.
 */
export function CrudProvider<T extends IEntity<string>>({
  config,
  service,
  children,
}: CrudProviderProps<T>) {
  const smart = useSmart();

  const crud = useMemo<CrudContextValue<T>>(() => {
    const registry = getRegistry(smart.http);
    const crudService = service ?? new CrudService<T>(config, smart.http);
    let feature = registry.features.get(config.entity);

    if (!feature) {
      const store = new CrudStore(
        config.entity,
        config.reducerFactory
          ? config.reducerFactory()
          : getReducer(config.entity),
      );
      const effects = new CrudEffects<T>(crudService);

      effects.init(store);
      feature = { store, effects };
      registry.features.set(config.entity, feature);
    } else {
      // The effects talk to the latest service, e.g. after `apiUrl` changed.
      feature.effects.service = crudService;
    }

    const facade = new CrudFacade<T>(feature.store, config);

    return {
      config,
      service: crudService,
      store: feature.store,
      facade,
      searchService: registry.searchService,
      listGroupService: new CrudListGroupService<T>(facade),
    };
  }, [config, service, smart.http]);

  // Attachments of the feature's items live under its own API.
  const smartValue = useMemo(
    () => ({
      ...smart,
      fileService: new FileService({ apiUrl: config.apiUrl }, smart.http, () =>
        smart.authService.getAccessToken(),
      ),
    }),
    [smart, config.apiUrl],
  );

  return (
    <SmartContext.Provider value={smartValue}>
      <CrudContext.Provider value={crud}>{children}</CrudContext.Provider>
    </SmartContext.Provider>
  );
}
