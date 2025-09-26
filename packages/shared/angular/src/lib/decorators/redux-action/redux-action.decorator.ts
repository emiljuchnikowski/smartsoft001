import { Guid } from 'guid-typescript';
import { isObservable } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';

import { NgrxStoreService } from '../../services';

export const ReduxAction = ReduxActionDecorator;
export function ReduxActionDecorator(options: any = {}) {
  function getActionsNames<T>(
    target: T,
    key: string,
  ): {
    begin: string;
    success: string;
    failure: string;
  } {
    const base = `${(target as any).constructor.name} ${key}`;

    return {
      begin: base,
      success: `${base} Success`,
      failure: `${base} Failure`,
    };
  }

  function beginAction(
    executionId: string,
    names: { begin: string },
    params: Array<any>,
  ): void {
    (NgrxStoreService as any).store.dispatch({
      executionId,
      type: names.begin,
      params,
    });
  }

  function errorAction(
    executionId: string,
    names: { failure: string },
    params: Array<any>,
    error: any,
  ): void {
    (NgrxStoreService as any).store.dispatch({
      executionId,
      type: names.failure,
      params,
      error,
    });
  }

  function successAction(
    executionId: string,
    names: { success: string },
    result: any,
  ): void {
    (NgrxStoreService as any).store.dispatch({
      executionId,
      type: names.success,
      result,
    });
  }

  return <T>(target: T, key: string, desc: PropertyDescriptor) => {
    const names = getActionsNames(target, key);

    const baseAction = (target as any)[key];

    desc.value = function (...params: any[]) {
      const executionId = Guid.raw();

      beginAction(executionId, names, params);

      let result;
      try {
        result = baseAction.apply(this, params);
      } catch (error) {
        errorAction(executionId, names, params, error);

        throw error;
      }

      if (result instanceof Promise) {
        result = result
          .then((r) => {
            successAction(executionId, names, r);
            return r;
          })
          .catch((e) => {
            errorAction(executionId, names, params, e);
            throw e;
          });
      } else if (isObservable(result)) {
        result = result.pipe(
          first(),
          tap((r) => {
            successAction(executionId, names, r);
          }),
          catchError((e) => {
            errorAction(executionId, names, params, e);
            throw e;
          }),
        );
      } else {
        successAction(executionId, names, result);
      }

      return result;
    };
  };
}
