import { useId } from 'react';

import { cn } from '../../../utils/class-names';
import { useInput } from '../base/use-input';
import { SmartInputFieldProps } from '../input.types';
import { toNumberValue } from './number-value';

const LABEL_CLASSES =
  'smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white';

const INPUT_CLASSES = [
  'smart:mt-2',
  'smart:block',
  'smart:w-full',
  'smart:rounded-md',
  'smart:bg-white',
  'smart:px-3',
  'smart:py-1.5',
  'smart:text-base',
  'smart:text-gray-900',
  'smart:outline-1',
  '-outline-offset-1',
  'smart:outline-gray-300',
  'smart:placeholder:text-gray-400',
  'smart:focus:outline-2',
  'smart:focus:outline-offset-2',
  'smart:focus:outline-indigo-600',
  'smart:sm:text-sm/6',
  'smart:dark:bg-white/5',
  'smart:dark:text-white',
  'smart:dark:outline-white/10',
  'smart:dark:placeholder:text-gray-500',
  'smart:dark:focus:outline-indigo-500',
];

/**
 * The integer field (`<smart-input-int>`, Angular `InputIntComponent`): a
 * number input with `step="1"`. An empty field sets `null`, anything else the
 * parsed number, as Angular's number value accessor does.
 */
export function SmartInputInt<T>(props: SmartInputFieldProps<T>) {
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
      <input
        id={id}
        type="number"
        step="1"
        className={cn(INPUT_CLASSES, className)}
        value={value ?? ''}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={(e) => setValue(toNumberValue(e.target.value))}
        onBlur={markAsTouched}
      />
    </>
  );
}
