import { useId } from 'react';

import { cn } from '../../../../utils/class-names';
import { useInput } from '../../base/use-input';
import { SmartInputFieldProps } from '../../input.types';
import { toNumberValue } from '../../int/number-value';

const LABEL_CLASSES =
  'smart:block smart:text-sm smart:font-medium smart:mb-2 smart:text-gray-800 smart:dark:text-gray-200';

const INPUT_CLASSES = [
  'smart:py-2.5',
  'smart:sm:py-3',
  'smart:px-4',
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
 * Preline-styled decimal number field (preset, Angular
 * `InputFloatPresetComponent`): the same number input with `step="0.01"` as
 * `SmartInputFloat`.
 */
export function SmartInputFloatPreset<T>(props: SmartInputFieldProps<T>) {
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
        {label}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
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
    </>
  );
}
