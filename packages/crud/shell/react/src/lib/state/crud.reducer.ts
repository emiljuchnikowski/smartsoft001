import { IEntity } from '@smartsoft001/domain-core';
import { PaginationMode } from '@smartsoft001/react';

import { ICrudFilter } from '../models';
import { CrudAction } from './crud.actions';

/** The state of one CRUD feature. */
export interface CrudState<T extends IEntity<string>> {
  selected?: T | null;
  multiSelected?: Array<T>;
  list?: T[];
  totalCount?: number | null;
  filter?: ICrudFilter | null;
  links?: any;
  /** False while a request of the feature is in flight. */
  loaded: boolean;
  /** The error of the last failed request, if any. */
  error?: any;
}

export const initialState: CrudState<any> = {
  loaded: false,
};

const crudReducer = (
  state: CrudState<any>,
  action: CrudAction,
  entity: string,
): CrudState<any> => {
  if (!state) {
    state = { ...initialState };
  }

  switch (action.type) {
    case `[${entity}] Create`:
      return {
        ...state,
        loaded: false,
        error: null,
      };

    case `[${entity}] Create Success`:
      return {
        ...state,
        loaded: true,
        error: null,
      };

    case `[${entity}] Create Failure`:
      return {
        ...state,
        loaded: true,
        error: action.error,
      };

    case `[${entity}] Create Many`:
      return {
        ...state,
        loaded: false,
        error: null,
      };

    case `[${entity}] Create Many Success`:
      return {
        ...state,
        loaded: true,
        error: null,
      };

    case `[${entity}] Create Many Failure`:
      return {
        ...state,
        loaded: true,
        error: action.error,
      };

    case `[${entity}] Export`:
      return {
        ...state,
        loaded: false,
      };

    case `[${entity}] Export Success`:
      return {
        ...state,
        loaded: true,
      };

    case `[${entity}] Export Failure`:
      return {
        ...state,
        loaded: true,
      };

    case `[${entity}] Read`:
      return {
        ...state,
        loaded: false,
        filter: action?.filter,
        error: null,
        totalCount: null,
        links: null,
      };

    case `[${entity}] Read Success`: {
      let list: any[] = [];

      if (
        action?.filter &&
        action?.filter.offset &&
        state.list &&
        action?.filter.paginationMode !== PaginationMode.singlePage
      ) {
        state.list.forEach((i) => {
          list.push(i);
        });

        list = [...list, ...action.result.data];
      } else {
        list = action.result.data;
      }

      return {
        ...state,
        loaded: true,
        list,
        totalCount: action?.result?.totalCount,
        links: action.result.links,
        error: null,
      };
    }

    case `[${entity}] Clear`:
      return { ...initialState };

    case `[${entity}] Read Failure`:
      return {
        ...state,
        loaded: true,
        error: action.error,
      };

    case `[${entity}] Select`:
      return {
        ...state,
        loaded: false,
        selected: null,
        error: null,
      };

    case `[${entity}] Select Success`:
      return {
        ...state,
        loaded: true,
        selected: action.item,
        error: null,
      };

    case `[${entity}] Select Failure`:
      return {
        ...state,
        loaded: true,
        error: action.error,
      };

    case `[${entity}] MultiSelect`:
      return {
        ...state,
        multiSelected: [...action.items],
      };

    case `[${entity}] Unselect`:
      return {
        ...state,
        loaded: true,
        selected: null,
        error: null,
      };

    case `[${entity}] Update`:
      return {
        ...state,
        loaded: false,
        error: null,
      };

    case `[${entity}] Update Success`:
      return {
        ...state,
        loaded: true,
        error: null,
      };

    case `[${entity}] Update Failure`:
      return {
        ...state,
        loaded: true,
        error: action.error,
      };

    case `[${entity}] Update partial`:
      return {
        ...state,
        loaded: false,
        error: null,
      };

    case `[${entity}] Update partial Success`:
      return {
        ...state,
        loaded: true,
        error: null,
      };

    case `[${entity}] Update partial Failure`:
      return {
        ...state,
        loaded: true,
        error: action.error,
      };

    case `[${entity}] Update partial many`:
      return {
        ...state,
        loaded: false,
        error: null,
      };

    case `[${entity}] Update partial many Success`:
      return {
        ...state,
        multiSelected: [],
        loaded: true,
        error: null,
      };

    case `[${entity}] Update partial many Failure`:
      return {
        ...state,
        loaded: true,
        error: action.error,
      };

    case `[${entity}] Delete`:
      return {
        ...state,
        loaded: false,
        error: null,
      };

    case `[${entity}] Delete Success`:
      return {
        ...state,
        loaded: true,
        error: null,
      };

    case `[${entity}] Delete Failure`:
      return {
        ...state,
        loaded: true,
        error: action.error,
      };

    default:
      return state;
  }
};

export type CrudReducer = (
  state: CrudState<any>,
  action: CrudAction,
) => CrudState<any>;

/** The reducer of the feature named `entity`. */
export function getReducer(entity: string): CrudReducer {
  return (state, action) => crudReducer(state, action, entity);
}
