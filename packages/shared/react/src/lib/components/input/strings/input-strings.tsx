import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { useInput } from '../base/use-input';
import { SmartInputFieldProps } from '../input.types';

const LABEL_CLASSES =
  'smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white';

interface StringsItem {
  key: number;
  value: string;
}

/**
 * The `strings` field: an input per string of the control's list, followed by
 * an empty one to add a string; a `×` button removes a string.
 *
 * The control is updated when an input's change is committed (the native
 * `change`: leaving the input or pressing Enter), keeping only the non-empty
 * strings and marking it touched and dirty, which also happens once when the
 * field is rendered. The label is bound to the first input.
 */
export function SmartInputStrings<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const t = useTranslate();
  const id = useId();
  const { control, required, disabled, label } = useInput(props);

  const nextKey = useRef(0);
  const [list, setList] = useState<StringsItem[]>([]);
  const pending = useRef(false);

  const refresh = useCallback(
    (items: StringsItem[]) => {
      if (!control) return;

      control.markAsTouched();
      control.markAsDirty();
      control.setValue(items.filter((i) => i && i.value).map((i) => i.value));

      const last = items[items.length - 1];

      setList(
        !items.length || (last && last.value)
          ? [...items, { key: nextKey.current++, value: '' }]
          : items,
      );
    },
    [control],
  );

  useEffect(() => {
    if (!control) return;

    const value = control.value;

    refresh(
      Array.isArray(value)
        ? value.map((v) => ({ key: nextKey.current++, value: v }))
        : [],
    );
  }, [control, refresh]);

  if (!control) return null;

  const change = (item: StringsItem, value: string) => {
    pending.current = true;
    setList(list.map((i) => (i.key === item.key ? { ...i, value } : i)));
  };

  const commit = () => {
    if (!pending.current) return;

    pending.current = false;
    refresh(list);
  };

  const removeItem = (item: StringsItem) => {
    refresh(list.filter((i) => i.key !== item.key));
  };

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div className={cn('smart:mt-2', 'smart:space-y-2', className)}>
        {list.map((item, index) => {
          const last = index === list.length - 1;

          return (
            <div
              key={item.key}
              className="smart:flex smart:items-center smart:gap-x-2"
            >
              <input
                id={index === 0 ? id : undefined}
                type="text"
                value={item.value ?? ''}
                placeholder={(last ? t('add') : '') + '...'}
                disabled={disabled}
                onChange={(event) => change(item, event.target.value)}
                onBlur={commit}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') commit();
                }}
                className="smart:block smart:w-full smart:rounded-md smart:bg-white smart:px-2 smart:py-1 smart:text-sm smart:text-gray-900 smart:outline-1 smart:outline-gray-300 smart:focus:outline-2 smart:focus:outline-indigo-600 smart:dark:bg-white/5 smart:dark:text-white smart:dark:outline-white/10"
              />
              {!last && (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeItem(item)}
                  className="smart:rounded-md smart:bg-red-600 smart:px-2 smart:py-1 smart:text-xs smart:font-semibold smart:text-white smart:hover:bg-red-500"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
