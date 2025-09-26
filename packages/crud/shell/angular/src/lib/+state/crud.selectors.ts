import { createFeatureSelector, createSelector } from '@ngrx/store';

export const getCrudState = (entity: string) =>
  createFeatureSelector<any>(entity);

export const getCrudSelected = (entity: string) =>
  createSelector(getCrudState(entity), (state) => state.selected);

export const getCrudMultiSelected = (entity: string) =>
  createSelector(getCrudState(entity), (state) => state.multiSelected);

export const getCrudList = (entity: string) =>
  createSelector(getCrudState(entity), (state) => state.list);

export const getCrudTotalCount = (entity: string) =>
  createSelector(getCrudState(entity), (state) => state.totalCount);

export const getCrudLinks = (entity: string) =>
  createSelector(getCrudState(entity), (state) => state.links);

export const getCrudLoaded = (entity: string) =>
  createSelector(getCrudState(entity), (state) => state.loaded);

export const getCrudFilter = (entity: string) =>
  createSelector(getCrudState(entity), (state) => state.filter);

export const getCrudError = (entity: string) =>
  createSelector(getCrudState(entity), (state) => state.error);
