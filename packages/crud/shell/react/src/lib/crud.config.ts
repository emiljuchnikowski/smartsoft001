import type { ComponentType } from 'react';

import {
  ICellPipe,
  IIconButtonOptions,
  ListMode,
  PaginationMode,
  SmartPageVariant,
} from '@smartsoft001/react';

import { ICrudFilterQueryItem, ICrudListGroup } from './models';
import type { CrudAction } from './state/crud.actions';
import type { CrudState } from './state/crud.reducer';

/**
 * What a CRUD feature talks to: the REST resource and the model. A plain
 * object handed to `<CrudProvider config>`.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CrudConfig<T> {
  apiUrl: string;
  /** The name the feature's state is kept under; one store per entity. */
  entity: string;
  /** The `@Model` class of the items. */
  type?: any;
  /** Replaces the default reducer of the feature. */
  reducerFactory?: () => (
    state: CrudState<any>,
    action: CrudAction,
  ) => CrudState<any>;
  /** Query items every read sends unless the filter brings its own. */
  baseQuery?: Array<ICrudFilterQueryItem>;
}

export interface CrudComponentSlots {
  top?: ComponentType<any>;
  bottom?: ComponentType<any>;
}

/** The configuration of the full CRUD screens (list + item pages). */
export interface CrudFullConfig<T> extends CrudConfig<T> {
  title: string;
  details?:
    | boolean
    | {
        cellPipe?: ICellPipe<T>;
        components?: CrudComponentSlots;
      };
  edit?:
    | boolean
    | {
        cellPipe?: ICellPipe<T>;
        components?: CrudComponentSlots;
      };
  add?:
    | boolean
    | {
        components?: CrudComponentSlots;
      };
  remove?: boolean;
  search?: boolean;
  export?: boolean;
  pagination?: {
    limit: number;
  };
  sort?:
    | boolean
    | {
        default?: string;
        defaultDesc?: boolean;
      };
  list?: {
    cellPipe?: ICellPipe<T>;
    components?: {
      top?: ComponentType<any>;
      multi?: ComponentType<any>;
    };
    mode?: ListMode;
    paginationMode?: PaginationMode;
    resetQuery?: 'beforeInit';
    groups?: Array<ICrudListGroup>;
  };
  buttons?: Array<IIconButtonOptions>;
  inputComponents?: {
    [key: string]: ComponentType<any>;
  };
  className?: string;
  variant?: SmartPageVariant;
}
