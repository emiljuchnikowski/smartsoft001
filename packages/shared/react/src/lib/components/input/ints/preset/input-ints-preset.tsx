import { useId } from 'react';

import { useTranslate } from '../../../../providers/hooks';
import { cn } from '../../../../utils/class-names';
import { SmartInputFieldProps } from '../../input.types';
import { useInputInts } from '../use-input-ints';

const LABEL_CLASSES =
  'smart:block smart:text-sm smart:font-medium smart:text-gray-800 smart:dark:text-gray-200';

const NUMBER_GROUP_CLASSES =
  'smart:grow smart:py-2 smart:px-3 smart:bg-white smart:dark:bg-gray-800 smart:border smart:border-gray-200 smart:dark:border-gray-700 smart:rounded-lg';

const INPUT_CLASSES =
  'smart:w-full smart:p-0 smart:bg-transparent smart:border-0 smart:text-gray-900 smart:dark:text-white smart:placeholder:text-gray-500 smart:dark:placeholder:text-gray-400 smart:focus:ring-0 smart:[&::-webkit-inner-spin-button]:appearance-none smart:[&::-webkit-outer-spin-button]:appearance-none';

const STEP_BUTTON_CLASSES = [
  'smart:size-6',
  'smart:inline-flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:gap-x-2',
  'smart:text-sm',
  'smart:font-medium',
  'smart:rounded-md',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
  'smart:shadow-2xs',
  'smart:hover:bg-gray-100',
  'smart:dark:hover:bg-gray-700',
  'smart:focus:outline-none',
  'smart:focus:bg-gray-100',
  'smart:dark:focus:bg-gray-700',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

const REMOVE_BUTTON_CLASSES = [
  'smart:size-9',
  'smart:shrink-0',
  'smart:inline-flex',
  'smart:justify-center',
  'smart:items-center',
  'smart:rounded-lg',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:text-red-600',
  'smart:dark:text-red-400',
  'smart:shadow-2xs',
  'smart:hover:bg-gray-100',
  'smart:dark:hover:bg-gray-700',
  'smart:focus:outline-none',
  'smart:focus:bg-gray-100',
  'smart:dark:focus:bg-gray-700',
].join(' ');

const ICON_CLASSES = 'smart:shrink-0 smart:size-3.5';

/**
 * Preline-styled list of integers field (preset, Angular
 * `InputIntsPresetComponent`): each row is a Preline number input with
 * decrease / increase buttons and a remove button, plus a trailing row to add
 * a number (see `useInputInts`).
 */
export function SmartInputIntsPreset<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const id = useId();
  const t = useTranslate();
  const {
    control,
    required,
    label,
    autoFocus,
    items,
    changeItem,
    removeItem,
    increment,
    decrement,
  } = useInputInts(props);

  if (!control) return null;

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div className={cn('smart:mt-2 smart:space-y-2', className)}>
        {items.map((item, index) => {
          const first = index === 0;
          const last = index === items.length - 1;

          return (
            <div
              key={item.id}
              className="smart:flex smart:items-center smart:gap-x-2"
            >
              <div className={NUMBER_GROUP_CLASSES}>
                <div className="smart:w-full smart:flex smart:justify-between smart:items-center smart:gap-x-3">
                  <div className="smart:grow">
                    <input
                      id={first ? id : undefined}
                      type="number"
                      step="1"
                      value={item.value ?? ''}
                      placeholder={(last ? t('add') : '') + '...'}
                      onChange={(e) => changeItem(item.id, e.target.value)}
                      autoFocus={first && autoFocus}
                      aria-roledescription="Number field"
                      style={{ MozAppearance: 'textfield' }}
                      className={INPUT_CLASSES}
                    />
                  </div>
                  <div className="smart:flex smart:justify-end smart:items-center smart:gap-x-1.5">
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label="Decrease"
                      onClick={() => decrement(item)}
                      className={STEP_BUTTON_CLASSES}
                    >
                      <svg
                        className={ICON_CLASSES}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label="Increase"
                      onClick={() => increment(item)}
                      className={STEP_BUTTON_CLASSES}
                    >
                      <svg
                        className={ICON_CLASSES}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              {!last && (
                <button
                  type="button"
                  aria-label="Remove"
                  onClick={() => removeItem(item.id)}
                  className={REMOVE_BUTTON_CLASSES}
                >
                  <svg
                    className={ICON_CLASSES}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
