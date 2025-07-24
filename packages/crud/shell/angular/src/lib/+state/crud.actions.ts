import { Action } from "@ngrx/store";

import { IEntity } from "@smartsoft001/domain-core";
import { ICrudCreateManyOptions, ICrudFilter } from "../models/interfaces";


/*
 * Create
 */
export const create = function<T extends IEntity<string>>(
  entity: string,
  item: T
): Action & { item: T } {
  return {
    type: `[${entity}] Create`,
    item
  };
};

export const createSuccess = function<T extends IEntity<string>>(
  entity: string,
  item: T
): Action & { item: T } {
  return {
    type: `[${entity}] Create Success`,
    item
  };
};

export const createFailure = function<T extends IEntity<string>>(
  entity: string,
  item: T,
  error
): Action & { item: T; error } {
  return {
    type: `[${entity}] Create Failure`,
    item,
    error
  };
};

/*
 * Create many
 */
export const createMany = function<T extends IEntity<string>>(
  entity: string,
  data: { items: T[]; options: ICrudCreateManyOptions }
): Action & { data: { items: T[]; options: ICrudCreateManyOptions } } {
  return {
    type: `[${entity}] Create Many`,
    data
  };
};

export const createManySuccess = function<T extends IEntity<string>>(
  entity: string,
  data: { items: T[]; options: ICrudCreateManyOptions }
): Action & { data: { items: T[]; options: ICrudCreateManyOptions } } {
  return {
    type: `[${entity}] Create Many Success`,
    data
  };
};

export const createManyFailure = function<T extends IEntity<string>>(
  entity: string,
  data: { items: T[]; options: ICrudCreateManyOptions },
  error
): Action & { data: { items: T[]; options: ICrudCreateManyOptions }; error } {
  return {
    type: `[${entity}] Create Many Failure`,
    data,
    error
  };
};

/*
 * Read
 */
export const read = function(
  entity: string,
  filter: ICrudFilter = null
): Action & { filter: ICrudFilter } {
  return {
    type: `[${entity}] Read`,
    filter
  };
};

export const readSuccess = function<T extends IEntity<string>, F>(
  entity: string,
  filter: F,
  result: { data: T[]; totalCount: number; links }
): Action & { result: { data: T[]; totalCount: number; links }; filter: F } {
  return {
    type: `[${entity}] Read Success`,
    result,
    filter
  };
};

export const readFailure = function<F>(
  entity: string,
  filter: F,
  error
): Action & { filter: F; error } {
  return {
    type: `[${entity}] Read Failure`,
    filter,
    error
  };
};

/*
 * Clear
 */
export const clear = function(
    entity: string,
): Action {
  return {
    type: `[${entity}] Clear`
  };
};

/*
 * Export
 */
export const exportList = function(
  entity: string,
  filter: ICrudFilter = null,
  format
): Action & { filter: ICrudFilter, format } {
  return {
    type: `[${entity}] Export`,
    filter,
    format
  };
};

export const exportListSuccess = function<T extends IEntity<string>, F>(
  entity: string,
  filter: F
): Action & { filter: F } {
  return {
    type: `[${entity}] Export Success`,
    filter
  };
};

export const exportListFailure = function<F>(
  entity: string,
  filter: F,
  error
): Action & { filter: F; error } {
  return {
    type: `[${entity}] Export Failure`,
    filter,
    error
  };
};

/*
 * Select
 */
export const select = function(
  entity: string,
  id: string
): Action & { id: string } {
  return {
    type: `[${entity}] Select`,
    id
  };
};

export const selectSuccess = function<T extends IEntity<string>, F>(
  entity: string,
  id: string,
  item: T
): Action & { id: string; item: T } {
  return {
    type: `[${entity}] Select Success`,
    id,
    item
  };
};

export const selectFailure = function<F>(
  entity: string,
  id: string,
  error
): Action & { id: string; error } {
  return {
    type: `[${entity}] Select Failure`,
    id,
    error
  };
};

export const unselect = function(entity: string): Action {
  return {
    type: `[${entity}] Unselect`
  };
};

/*
 * MultiSelect
 */
export const multiSelect = function<T extends IEntity<string>>(
    entity: string,
    items: Array<T>
): Action & { items: Array<T> } {
  return {
    type: `[${entity}] MultiSelect`,
    items
  };
};

/*
 * Update
 */
export const update = function<T extends IEntity<string>>(
  entity: string,
  item: T
): Action & { item: T } {
  return {
    type: `[${entity}] Update`,
    item
  };
};

export const updateSuccess = function<T extends IEntity<string>>(
  entity: string,
  item: T
): Action & { item: T } {
  return {
    type: `[${entity}] Update Success`,
    item
  };
};

export const updateFailure = function<T extends IEntity<string>>(
  entity: string,
  item: T,
  error
): Action & { item: T; error } {
  return {
    type: `[${entity}] Update Failure`,
    item,
    error
  };
};

/*
 * Update partial
 */
export const updatePartial = function<T extends IEntity<string>>(
  entity: string,
  item: Partial<T> & { id: string }
): Action & { item: Partial<T> & { id: string } } {
  return {
    type: `[${entity}] Update partial`,
    item
  };
};

export const updatePartialSuccess = function<T extends IEntity<string>>(
  entity: string,
  item: Partial<T> & { id: string }
): Action & { item: Partial<T> & { id: string } } {
  return {
    type: `[${entity}] Update partial Success`,
    item
  };
};

export const updatePartialFailure = function<T extends IEntity<string>>(
  entity: string,
  item: Partial<T> & { id: string },
  error
): Action & { item: Partial<T> & { id: string }; error } {
  return {
    type: `[${entity}] Update partial Failure`,
    item,
    error
  };
};

/*
 * Update partial many
 */
export const updatePartialMany = function<T extends IEntity<string>>(
    entity: string,
    items: Partial<T> & { id: string }[]
): Action & { items: Partial<T> & { id: string }[] } {
  return {
    type: `[${entity}] Update partial many`,
    items
  };
};

export const updatePartialManySuccess = function<T extends IEntity<string>>(
    entity: string,
    items: Partial<T> & { id: string }[]
): Action & { items: Partial<T> & { id: string }[] } {
  return {
    type: `[${entity}] Update partial many Success`,
    items
  };
};

export const updatePartialManyFailure = function<T extends IEntity<string>>(
    entity: string,
    items: Partial<T> & { id: string }[],
    error
): Action & { items: Partial<T> & { id: string }[]; error } {
  return {
    type: `[${entity}] Update partial many Failure`,
    items,
    error
  };
};

/*
 * Delete
 */
export const deleteItem = function(
  entity: string,
  id: string
): Action & { id: string } {
  return {
    type: `[${entity}] Delete`,
    id
  };
};

export const deleteSuccess = function(
  entity: string,
  id: string
): Action & { id: string } {
  return {
    type: `[${entity}] Delete Success`,
    id
  };
};

export const deleteFailure = function<F>(
  entity: string,
  id: string,
  error
): Action & { id: string; error } {
  return {
    type: `[${entity}] Delete Failure`,
    id,
    error
  };
};
