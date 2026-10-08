import { useId } from 'react';

import { cn } from '../../../utils/class-names';
import { useInput } from '../base/use-input';
import { SmartInputFieldProps } from '../input.types';

const LABEL_CLASSES =
  'smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white';

const INPUT_CLASSES = [
  'smart:h-4',
  'smart:w-4',
  'smart:rounded',
  'smart:border-gray-300',
  'smart:text-indigo-600',
  'smart:focus:ring-indigo-500',
  'smart:dark:border-gray-600',
  'smart:dark:bg-white/5',
];

/**
 * The yes/no field: a checkbox followed by its label, bound to a boolean value.
 */
export function SmartInputFlag<T>(props: SmartInputFieldProps<T>) {
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
    <div className="smart:flex smart:items-center smart:gap-x-2">
      <input
        id={id}
        type="checkbox"
        className={cn(INPUT_CLASSES, className)}
        checked={!!value}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.checked)}
        onBlur={markAsTouched}
      />
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
    </div>
  );
}
