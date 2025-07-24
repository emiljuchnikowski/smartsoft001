import {createFeatureSelector, createSelector} from "@ngrx/store";

export const getCrudState = (entity) => createFeatureSelector< any>(entity);

export const getCrudSelected = (entity) => createSelector(
    getCrudState(entity),
    (state) => state.selected
);

export const getCrudMultiSelected = (entity) => createSelector(
    getCrudState(entity),
    (state) => state.multiSelected
);

export const getCrudList = (entity) => createSelector(
    getCrudState(entity),
    (state) => state.list
);

export const getCrudTotalCount = (entity) => createSelector(
    getCrudState(entity),
    (state) => state.totalCount
);

export const getCrudLinks = (entity) => createSelector(
    getCrudState(entity),
    (state) => state.links
);

export const getCrudLoaded = (entity) => createSelector(
    getCrudState(entity),
    (state) => state.loaded
);

export const getCrudFilter = (entity) => createSelector(
    getCrudState(entity),
    (state) => state.filter
);

export const getCrudError = (entity) => createSelector(
    getCrudState(entity),
    (state) => state.error
);
