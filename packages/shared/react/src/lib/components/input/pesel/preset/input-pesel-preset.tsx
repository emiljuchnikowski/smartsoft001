import { useEffect, useId } from 'react';

import { PeselService } from '@smartsoft001/utils';

import { SmartValidatorFn } from '../../../../forms/abstract-control';
import { cn } from '../../../../utils/class-names';
import { useInput } from '../../base/use-input';
import { SmartInputFieldProps } from '../../input.types';

const LABEL_CLASSES = [
  'smart:block',
  'smart:text-sm',
  'smart:font-medium',
  'smart:mb-2',
  'smart:text-gray-800',
  'smart:dark:text-gray-200',
].join(' ');

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
].join(' ');

/** Reports `invalidPesel` for a non-empty value that is not a valid PESEL. */
const peselValidator: SmartValidatorFn = (c) => {
  if (c.value && PeselService.isInvalid(c.value)) {
    return {
      invalidPesel: true,
    };
  }

  return null;
};

/**
 * Styled `pesel` field (preset, the Angular `InputPeselPresetComponent`):
 * the Preline look of {@link SmartInputPesel}. Unlike the standard field it
 * adds the PESEL check to the control's validators (`invalidPesel`), as the
 * Angular preset did once its options were set. The validator is one shared
 * function, so it is never stacked, and it stays on the control after the
 * field unmounts, as in Angular. Register it as
 * `inputFieldComponents[FieldType.pesel]` on `SmartProvider`.
 */
export function SmartInputPeselPreset<T>(props: SmartInputFieldProps<T>) {
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

  useEffect(() => {
    if (!control) return;

    control.addValidators(peselValidator);
    control.updateValueAndValidity();
  }, [control]);

  if (!control) return null;

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type="text"
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
