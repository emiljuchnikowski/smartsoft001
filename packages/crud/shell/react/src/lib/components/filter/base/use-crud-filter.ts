import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { FieldType, IModelFilter } from '@smartsoft001/models';
import {
  InputOptions,
  SmartAbstractControl,
  SmartFormControl,
  useSmart,
} from '@smartsoft001/react';

import { useCrudConfig, useCrudFacade } from '../../../crud.context';
import { ICrudFilter, ICrudFilterQueryItem } from '../../../models';
import { CrudFilterPossibility, SmartCrudFilterProps } from '../filter.types';

/** The wait of the Angular `@Debounce(500)` on `refresh`. */
export const CRUD_FILTER_REFRESH_DEBOUNCE = 500;

type QueryType = ICrudFilterQueryItem['type'];

/** The filter a field pushed to `facade.read`, and the prop it came from. */
interface PendingFilter {
  source: ICrudFilter | null | undefined;
  filter: ICrudFilter;
}

/** What `useCrudFilter` returns (the API of the Angular `BaseComponent`). */
export interface UseCrudFilterResult {
  /** The item's value (a list for a check filter); `null` without a query. */
  value: any;
  /** The item's `>=` value (range "from"). */
  minValue: any;
  /** The item's `<=` value (range "to"). */
  maxValue: any;
  /** Debounced `refresh(val)` (the Angular `value` setter). */
  setValue: (val: any) => void;
  /** Debounced `refresh(val, '>=')` (the Angular `minValue` setter). */
  setMinValue: (val: any) => void;
  /** Debounced `refresh(val, '<=')` (the Angular `maxValue` setter). */
  setMaxValue: (val: any) => void;
  /** The item's entry has a non-empty value. */
  hasValue: boolean;
  /** The item's `>=` entry has a non-empty value. */
  hasMinValue: boolean;
  /** The item's `<=` entry has a non-empty value. */
  hasMaxValue: boolean;
  /** The options of a radio / check filter. */
  possibilities: CrudFilterPossibility[] | undefined;
  /** An instance of the feature's model, for the input options. */
  model: any;
  /** The current language. */
  lang: string;
  /** The filter the values are read from (the pending copy or the prop). */
  effectiveFilter: ICrudFilter | null | undefined;
  /**
   * Sets the item's entry of `type` (`item.type` by default) to `val`, or
   * removes it for an empty value, and reads the list from the first page;
   * debounced by 500 ms.
   */
  refresh: (val: any, type?: string | null) => void;
  /** Removes every entry of the item and reads the list from the first page. */
  clear: () => void;
  /**
   * The options of a shared `SmartInput*` field bound to `control`; with the
   * possibilities as unchecked options when `withPossibilities`.
   */
  buildInputOptions: (
    control: SmartAbstractControl,
    withPossibilities?: boolean,
  ) => InputOptions<any>;
}

/**
 * The item's own possibilities: an Angular-style signal (as typed in
 * `IModelFilter`) or a plain list.
 */
function readItemPossibilities(
  source: unknown,
): CrudFilterPossibility[] | undefined {
  if (typeof source === 'function') return source();
  if (Array.isArray(source)) return source;

  return undefined;
}

/** A check filter holds a list of values, one query entry each. */
function isArrayType(item: IModelFilter | undefined): boolean {
  return item?.fieldType === FieldType.check;
}

/**
 * The pending working copy while the `filter` prop is still the one it was
 * derived from; once the store update brings a new prop, the prop wins.
 */
function getEffectiveFilter(
  filter: ICrudFilter | null | undefined,
  pending: PendingFilter | null,
): ICrudFilter | null | undefined {
  if (pending && filter === pending.source) return pending.filter;

  return filter;
}

/**
 * A copy safe to change (object, query list and entries), so the filter in
 * the store is never touched.
 */
function cloneFilter(
  source: ICrudFilter | null | undefined,
): ICrudFilter | undefined {
  if (!source) return undefined;

  const clone: ICrudFilter = { ...source };

  if (source.query) clone.query = source.query.map((q) => ({ ...q }));

  return clone;
}

/**
 * The value of the item's query entry of `type` (the Angular `value`,
 * `minValue` and `maxValue` getters): `null` without a query, the list of
 * matching values for a check filter, otherwise the first match's value.
 */
function readQueryValue(
  filter: ICrudFilter | null | undefined,
  item: IModelFilter | undefined,
  type: string | undefined,
): any {
  if (!filter || !item || !filter.query) return null;

  if (isArrayType(item)) {
    return filter.query
      .filter((q) => q.key === item.key && q.type === type)
      .map((q) => q.value);
  }

  const query = filter.query.find((q) => q.key === item.key && q.type === type);
  return query?.value;
}

function hasQueryValue(
  filter: ICrudFilter | null | undefined,
  item: IModelFilter | undefined,
  type: string | undefined,
): boolean {
  if (!filter || !item || !filter.query) return false;

  const query = filter.query.find((q) => q.key === item.key && q.type === type);

  if (!query) return false;

  const val = query.value;
  return val !== null && val !== undefined && val !== '';
}

function refreshArrayFilter(
  filter: ICrudFilter,
  item: IModelFilter,
  vals: any[] | null | undefined,
  type: string,
): ICrudFilter {
  const query = (filter.query ?? []).filter(
    (q) => !(q.key === item.key && q.type === type),
  );

  filter.query = query;

  if (vals === null || vals === undefined || !vals.length) return filter;

  vals.forEach((val) => {
    query.push({ key: item.key, type: type as QueryType, value: val });
  });

  return filter;
}

/**
 * The filter after `refresh(val, type)` (the Angular `refresh` body): back on
 * the first page, with the item's entry of the slot set to `val`, or removed
 * for an empty value. `null` when there is nothing to read.
 */
function refreshFilter(
  source: ICrudFilter | null | undefined,
  item: IModelFilter | undefined,
  val: any,
  type: string | null,
): ICrudFilter | null {
  const filter = cloneFilter(source);
  if (!filter || !item) return null;

  const slot = type || item.type;
  if (!filter.query) filter.query = [];

  filter.offset = 0;

  if (isArrayType(item)) return refreshArrayFilter(filter, item, val, slot);

  const queries = filter.query;
  let query = queries.find((q) => q.key === item.key && q.type === slot);

  if (val === null || val === undefined || val === '') {
    if (query) queries.splice(queries.indexOf(query), 1);

    return filter;
  }

  if (!query) {
    query = { key: item.key, type: slot as QueryType, value: null };
    queries.push(query);
  }

  query.value = val;
  query.label = item.label;

  return filter;
}

/** The filter without any entry of the item, back on the first page. */
function clearFilter(
  source: ICrudFilter | null | undefined,
  item: IModelFilter | undefined,
): ICrudFilter | null {
  const filter = cloneFilter(source);
  if (!filter || !item || !filter.query) return null;

  filter.query = filter.query.filter((q) => q.key !== item.key);
  filter.offset = 0;

  return filter;
}

/**
 * The options of the item: the ones the model possibilities provider returns
 * for the model type and the item key (where the Angular filter asked the
 * deprecated `CRUD_MODEL_POSSIBILITIES_PROVIDER`), otherwise the item's own.
 */
function useFilterPossibilities(
  item: IModelFilter | undefined,
  modelType: unknown,
  model: unknown,
): CrudFilterPossibility[] | undefined {
  const provider = useSmart().modelPossibilitiesProvider;
  const key = item?.key;
  const [fromProvider, setFromProvider] = useState<{
    key: string;
    list: CrudFilterPossibility[];
  } | null>(null);

  useEffect(() => {
    if (!provider || !key) return undefined;

    let active = true;

    Promise.resolve(
      provider.get({ type: modelType, key, instance: model }),
    ).then((list) => {
      if (active && list) setFromProvider({ key, list });
    });

    return () => {
      active = false;
    };
  }, [provider, modelType, key, model]);

  if (fromProvider && fromProvider.key === key) return fromProvider.list;

  return readItemPossibilities(item?.possibilities);
}

/**
 * The behaviour every filter field shares (the Angular filter
 * `BaseComponent`): the item's values in the current filter, and `refresh` /
 * `clear`, which read the list through the facade with a changed copy of the
 * filter. Until the store's new filter comes back through the `filter` prop,
 * the values are read from that copy.
 *
 * `refresh` is debounced by 500 ms like the Angular `@Debounce(500)`: only
 * the last call within the wait is applied, and a pending call still runs
 * after the field unmounts.
 */
export function useCrudFilter({
  item,
  filter,
}: SmartCrudFilterProps): UseCrudFilterResult {
  const facade = useCrudFacade();
  const modelType = useCrudConfig().type;
  const lang = useSmart().language;
  const model = useMemo(
    () => (modelType ? new modelType() : undefined),
    [modelType],
  );
  const possibilities = useFilterPossibilities(item, modelType, model);
  const [pending, setPending] = useState<PendingFilter | null>(null);
  const effectiveFilter = getEffectiveFilter(filter, pending);
  const latest = useRef({ item, filter, pending, facade });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    latest.current = { item, filter, pending, facade };
  });

  const commitFilter = useCallback((next: ICrudFilter | null) => {
    if (!next) return;

    const current = latest.current;
    const entry: PendingFilter = { source: current.filter, filter: next };

    current.pending = entry;
    setPending(entry);
    current.facade.read(next);
  }, []);

  const refresh = useCallback(
    (val: any, type: string | null = null) => {
      if (timer.current) clearTimeout(timer.current);

      timer.current = setTimeout(() => {
        timer.current = null;

        const current = latest.current;

        commitFilter(
          refreshFilter(
            getEffectiveFilter(current.filter, current.pending),
            current.item,
            val,
            type,
          ),
        );
      }, CRUD_FILTER_REFRESH_DEBOUNCE);
    },
    [commitFilter],
  );

  const clear = useCallback(() => {
    const current = latest.current;

    commitFilter(
      clearFilter(
        getEffectiveFilter(current.filter, current.pending),
        current.item,
      ),
    );
  }, [commitFilter]);

  const setValue = useCallback((val: any) => refresh(val), [refresh]);
  const setMinValue = useCallback((val: any) => refresh(val, '>='), [refresh]);
  const setMaxValue = useCallback((val: any) => refresh(val, '<='), [refresh]);

  const fieldKey = item?.key ?? '';
  const buildInputOptions = useCallback(
    (control: SmartAbstractControl, withPossibilities = false) => {
      const options: InputOptions<any> = {
        treeLevel: 0,
        control,
        model,
        fieldKey,
      };

      if (withPossibilities) {
        options.possibilities = (possibilities ?? []).map(({ id, text }) => ({
          id,
          text,
          checked: false,
        }));
      }

      return options;
    },
    [model, fieldKey, possibilities],
  );

  return {
    value: readQueryValue(effectiveFilter, item, item?.type),
    minValue: readQueryValue(effectiveFilter, item, '>='),
    maxValue: readQueryValue(effectiveFilter, item, '<='),
    setValue,
    setMinValue,
    setMaxValue,
    hasValue: hasQueryValue(effectiveFilter, item, item?.type),
    hasMinValue: hasQueryValue(effectiveFilter, item, '>='),
    hasMaxValue: hasQueryValue(effectiveFilter, item, '<='),
    possibilities,
    model,
    lang,
    effectiveFilter,
    refresh,
    clear,
    buildInputOptions,
  };
}

/**
 * A form control bridged to one query slot of a filter (the Angular
 * `bindControl(type)`; `bindValueControl()` is `type` `null`): seeded once with
 * the slot's current value (`null` = `value`, `'>='` = `minValue`, `'<='` =
 * `maxValue`), and every change runs the debounced `refresh` for the slot.
 * As in Angular, the control is not re-synced when the filter changes
 * elsewhere (TODO GAP-19).
 */
export function useCrudFilterControl(
  {
    value,
    minValue,
    maxValue,
    refresh,
  }: Pick<UseCrudFilterResult, 'value' | 'minValue' | 'maxValue' | 'refresh'>,
  type: string | null = null,
): SmartFormControl {
  const [control] = useState(
    () =>
      new SmartFormControl(
        type === '>=' ? minValue : type === '<=' ? maxValue : value,
      ),
  );

  useEffect(() => {
    const subscription = control.valueChanges.subscribe((val) =>
      refresh(val, type),
    );

    return () => subscription.unsubscribe();
  }, [control, refresh, type]);

  return control;
}
