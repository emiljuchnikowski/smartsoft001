import { Selector } from '@ngrx/store';

import { NgrxStoreService } from '../../services/ngrx-store/ngrx-store.service';

export function ReduxSelect<TState = any, TValue = any>(
  selector: Selector<TState, TValue>,
): (target: any, name: string) => void;

export function ReduxSelect<TState = any, TValue = any>(
  selectorOrFeature?: string,
  ...paths: string[]
): (target: any, name: string) => void;

export function ReduxSelect<TState = any, TValue = any>(
  selectorOrFeature?: string | Selector<TState, TValue>,
  ...paths: string[]
) {
  return function (target: any, name: string): void {
    const selectorFnName = '__' + name + '__selector';
    let fn: Selector<TState, TValue>;
    // Nothing here? Use propery name as selector
    if (!selectorOrFeature) {
      selectorOrFeature = name;
    }
    // Handle string vs Selector<TState, TValue>
    if (typeof selectorOrFeature === 'string') {
      const propsArray = paths.length
        ? [selectorOrFeature, ...paths]
        : selectorOrFeature.split('.');
      fn = fastPropGetter(propsArray);
    } else {
      fn = selectorOrFeature;
    }

    const createSelect = () => {
      const store = NgrxStoreService.store;
      if (!store) {
        throw new Error('NgrxSelect not connected to store!');
      }
      return store.select(fn);
    };

    if (target[selectorFnName]) {
      throw new Error(
        'You cannot use @Select decorator and a ' +
          selectorFnName +
          ' property.',
      );
    }

    // Redefine property
    if (delete target[name]) {
      Object.defineProperty(target, selectorFnName, {
        writable: true,
        enumerable: false,
        configurable: true,
      });

      Object.defineProperty(target, name, {
        get: function () {
          return (
            this[selectorFnName] ||
            (this[selectorFnName] = createSelect.apply(this))
          );
        },
        enumerable: true,
        configurable: true,
      });
    }
  };
}

export function fastPropGetter(paths: string[]): (x: any) => any {
  const segments = paths;
  let seg = 'store.' + segments[0],
    i = 0;
  const l = segments.length;
  let expr = seg;
  while (++i < l) {
    expr = expr + ' && ' + (seg = seg + '.' + segments[i]);
  }
  const fn = new Function('store', 'return ' + expr + ';');
  return <(x: any) => any>fn;
}
