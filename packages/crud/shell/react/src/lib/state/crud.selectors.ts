import { CrudState } from './crud.reducer';

/*
 * The selectors of a CRUD feature. Each feature has a store of its own, so
 * they take that store's state.
 */
export const getCrudSelected = <T>(state: CrudState<any>): T | undefined =>
  state?.selected;
export const getCrudMultiSelected = <T>(
  state: CrudState<any>,
): T[] | undefined => state?.multiSelected;
export const getCrudList = <T>(state: CrudState<any>): T[] | undefined =>
  state?.list;
export const getCrudTotalCount = (state: CrudState<any>) => state?.totalCount;
export const getCrudLinks = (state: CrudState<any>) => state?.links;
export const getCrudLoaded = (state: CrudState<any>) => state?.loaded;
export const getCrudFilter = (state: CrudState<any>) => state?.filter;
export const getCrudError = (state: CrudState<any>) => state?.error;
