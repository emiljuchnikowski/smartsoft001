import { useId } from 'react';

import { cn } from '../../../../utils/class-names';
import { useInput } from '../../base/use-input';
import { SmartInputFieldProps } from '../../input.types';

const LABEL_CLASSES = [
  'smart:block',
  'smart:mb-2',
  'smart:text-sm',
  'smart:font-medium',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

const INPUT_CLASSES = [
  // Preline: py-3 px-4 block w-full
  'smart:py-3',
  'smart:px-4',
  'smart:block',
  'smart:w-full',
  // Preline: bg-layer
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  // Preline: border-layer-line
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  // Preline: rounded-lg sm:text-sm
  'smart:rounded-lg',
  'smart:sm:text-sm',
  // Preline: text-foreground
  'smart:text-gray-900',
  'smart:dark:text-white',
  // Preline: placeholder:text-muted-foreground-1
  'smart:placeholder:text-gray-500',
  'smart:dark:placeholder:text-gray-400',
  // Preline: focus:border-primary-focus focus:ring-primary-focus
  'smart:focus:border-blue-700',
  'smart:dark:focus:border-blue-600',
  'smart:focus:ring-1',
  'smart:focus:ring-blue-700',
  'smart:dark:focus:ring-blue-600',
  // Preline: disabled:opacity-50 disabled:pointer-events-none
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
].join(' ');

/**
 * Styled `date` field (preset, the Angular `InputDatePresetComponent`,
 * `<smart-input-date-preset>`): the Preline datepicker input look of
 * {@link SmartInputDate}. Register it as `inputFieldComponents[FieldType.date]`
 * on `SmartProvider`.
 *
 * Like the Angular preset it renders a native `type="date"` input: the
 * Preline advanced datepicker needs Vanilla Calendar Pro and the Preline JS
 * plugin, which the library does not ship.
 */
export function SmartInputDatePreset<T>(props: SmartInputFieldProps<T>) {
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
