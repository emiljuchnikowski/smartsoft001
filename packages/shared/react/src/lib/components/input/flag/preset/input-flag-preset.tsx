import { useId } from 'react';

import { cn } from '../../../../utils/class-names';
import { useInput } from '../../base/use-input';
import { SmartInputFieldProps } from '../../input.types';

const GROUP_CLASSES = 'smart:mt-2 smart:flex smart:items-center smart:gap-x-2';

const LABEL_CLASSES =
  'smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white';

// Preline "Default checkbox" look translated to smart:-prefixed vanilla
// Tailwind with explicit dark: variants.
const INPUT_CLASSES = [
  'smart:shrink-0',
  'smart:size-4',
  'smart:bg-transparent',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:rounded-sm',
  'smart:shadow-2xs',
  'smart:text-blue-600',
  'smart:dark:text-blue-400',
  'smart:focus:ring-0',
  'smart:focus:ring-offset-0',
  'smart:checked:bg-blue-700',
  'smart:dark:checked:bg-blue-600',
  'smart:checked:border-blue-700',
  'smart:dark:checked:border-blue-600',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
];

/**
 * Preline-styled yes/no field (preset, Angular `InputFlagPresetComponent`):
 * the checkbox and label of `SmartInputFlag` with the Preline checkbox look.
 */
export function SmartInputFlagPreset<T>(props: SmartInputFieldProps<T>) {
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
    <div className={GROUP_CLASSES} data-role="flag-group">
      <input
        id={id}
        type="checkbox"
        className={cn(INPUT_CLASSES, className)}
        checked={!!value}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.checked)}
        onBlur={markAsTouched}
        data-role="checkbox"
      />
      <label htmlFor={id} className={LABEL_CLASSES} data-role="label">
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
    </div>
  );
}
