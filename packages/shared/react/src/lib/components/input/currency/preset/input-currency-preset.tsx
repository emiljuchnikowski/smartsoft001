import { useId } from 'react';

import { cn } from '../../../../utils/class-names';
import { useInput } from '../../base/use-input';
import { SmartInputFieldProps } from '../../input.types';
import { toNumberValue } from '../../int/number-value';

const LABEL_CLASSES =
  'smart:block smart:text-sm smart:font-medium smart:mb-2 smart:text-gray-800 smart:dark:text-gray-200';

const ADORNMENT_CLASSES =
  'smart:absolute smart:inset-y-0 smart:start-0 smart:flex smart:items-center smart:pointer-events-none smart:ps-4 smart:peer-disabled:opacity-50 smart:peer-disabled:pointer-events-none';

const INPUT_CLASSES = [
  'smart:peer',
  'smart:py-2.5',
  'smart:sm:py-3',
  'smart:px-4',
  'smart:ps-11',
  'smart:block',
  'smart:w-full',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:rounded-lg',
  'smart:sm:text-sm',
  'smart:text-gray-900',
  'smart:dark:text-white',
  'smart:placeholder:text-gray-500',
  'smart:dark:placeholder:text-gray-400',
  'smart:focus:border-blue-600',
  'smart:dark:focus:border-blue-500',
  'smart:focus:ring-1',
  'smart:focus:ring-blue-600',
  'smart:dark:focus:ring-blue-500',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
];

/**
 * Preline-styled amount field (preset): the number input of
 * `SmartInputCurrency` with a leading currency icon.
 */
export function SmartInputCurrencyPreset<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const id = useId();
  const {
    control,
    value,
    required,
    disabled,
    label,
    autoFocus,
    setValue,
    markAsTouched,
  } = useInput(props);

  if (!control) return null;

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div className="smart:relative">
        <div className={ADORNMENT_CLASSES} data-role="currency-adornment">
          <svg
            className="smart:shrink-0 smart:size-4 smart:text-gray-500 smart:dark:text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <input
          id={id}
          type="number"
          step="0.01"
          className={cn(INPUT_CLASSES, className)}
          value={value ?? ''}
          disabled={disabled}
          autoFocus={autoFocus}
          onChange={(e) => setValue(toNumberValue(e.target.value))}
          onBlur={markAsTouched}
        />
      </div>
    </>
  );
}
