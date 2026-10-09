import { useId } from 'react';

import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { SmartInputFieldProps } from '../input.types';
import { useInputInts } from './use-input-ints';

const LABEL_CLASSES =
  'smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white';

const INPUT_CLASSES =
  'smart:block smart:w-full smart:rounded-md smart:bg-white smart:px-2 smart:py-1 smart:text-sm smart:text-gray-900 smart:outline-1 smart:outline-gray-300 smart:focus:outline-2 smart:focus:outline-indigo-600 smart:dark:bg-white/5 smart:dark:text-white smart:dark:outline-white/10';

const REMOVE_CLASSES =
  'smart:rounded-md smart:bg-red-600 smart:px-2 smart:py-1 smart:text-xs smart:font-semibold smart:text-white smart:hover:bg-red-500';

/**
 * The list of integers field: a number input per value with a `×` button to
 * remove it, and a trailing input to add one (see `useInputInts`).
 */
export function SmartInputInts<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const id = useId();
  const t = useTranslate();
  const { control, required, label, items, changeItem, removeItem } =
    useInputInts(props);

  if (!control) return null;

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div className={cn('smart:mt-2 smart:space-y-2', className)}>
        {items.map((item, index) => {
          const last = index === items.length - 1;

          return (
            <div
              key={item.id}
              className="smart:flex smart:items-center smart:gap-x-2"
            >
              <input
                id={index === 0 ? id : undefined}
                type="number"
                value={item.value ?? ''}
                placeholder={(last ? t('add') : '') + '...'}
                onChange={(e) => changeItem(item.id, e.target.value)}
                className={INPUT_CLASSES}
              />
              {!last && (
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className={REMOVE_CLASSES}
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
