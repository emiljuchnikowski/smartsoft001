import { createContext, useContext } from 'react';

import { IEntity } from '@smartsoft001/domain-core';

import { CrudConfig, CrudFullConfig } from './crud.config';
import { CrudService } from './services/crud/crud.service';
import { CrudListGroupService } from './services/list-group/list-group.service';
import { CrudSearchService } from './services/search/search.service';
import { CrudFacade } from './state/crud.facade';
import { CrudStore } from './state/crud.store';

export interface CrudContextValue<T extends IEntity<string>> {
  config: CrudConfig<T> & Partial<CrudFullConfig<T>>;
  service: CrudService<T>;
  store: CrudStore;
  facade: CrudFacade<T>;
  searchService: CrudSearchService;
  listGroupService: CrudListGroupService<T>;
}

export const CrudContext = createContext<CrudContextValue<any> | null>(null);

/** The CRUD feature the component is rendered in (`<CrudProvider>`). */
export function useCrud<T extends IEntity<string>>(): CrudContextValue<T> {
  const context = useContext(CrudContext);

  if (!context) {
    throw new Error(
      'useCrud: render the component inside <CrudProvider config={...}>',
    );
  }

  return context as CrudContextValue<T>;
}

export const useCrudConfig = <T extends IEntity<string>>() =>
  useCrud<T>().config;
export const useCrudService = <T extends IEntity<string>>() =>
  useCrud<T>().service;
export const useCrudFacade = <T extends IEntity<string>>() =>
  useCrud<T>().facade;
export const useCrudSearchService = () => useCrud().searchService;
export const useCrudListGroupService = <T extends IEntity<string>>() =>
  useCrud<T>().listGroupService;
