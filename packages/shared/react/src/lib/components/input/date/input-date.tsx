import { useId } from 'react';

import { cn } from '../../../utils/class-names';
import { useInput } from '../base/use-input';
import { SmartInputFieldProps } from '../input.types';

const LABEL_CLASSES = [
  'smart:block',
  'smart:text-sm/6',
  'smart:font-medium',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

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
].join(' ');

/**
 * The `date` field (the Angular `InputDateComponent`,
 * `<smart-input-date>`): the model label and a native `type="date"` input
 * bound to the control (`YYYY-MM-DD`). `className` is appended to the input's
 * classes.
 *
 * The Angular component's `valueChanges` subscription re-formatted a value
 * that is not 10 characters long with moment, but that call is commented out
 * there (`TODO: re-enable moment`), so the value is bound as it is here too.
 */
export function SmartInputDate<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const {
    control,
    value,
    required,
    disabled,
    label,
    setValue,
    markAsTouched,
    autoFocus,
  } = useInput(props);
  const id = useId();

  if (!control) return null;

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type="date"
        className={cn(INPUT_CLASSES, className)}
        value={value ?? ''}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        onBlur={markAsTouched}
      />
    </>
  );
}
