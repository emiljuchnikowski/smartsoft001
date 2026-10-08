import { useId, useState } from 'react';

import { useInputPassword } from './use-input-password';
import { cn } from '../../../utils/class-names';
import { SmartPasswordStrength } from '../../password-strength/password-strength';
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
 * The `password` field (the Angular `InputPasswordComponent`,
 * `<smart-input-password>`): the model label and a `type="password"` input
 * bound to the control. With `fieldOptions.possibilities.strength` it renders
 * `<SmartPasswordStrength>` under the input (hints while the input has
 * focus), whose rating sets the control's `passwordStrength` error (see
 * {@link useInputPassword}).
 *
 * A `<key>Confirm` control (added by the form factory for `confirm: true`)
 * renders through the same component: `<SmartInput>` gives it the options of
 * `<key>`, the label is the one of `<key>Confirm`, and it is bound to, and
 * rated by, its own value. `className` is appended to the input's classes.
 */
export function SmartInputPassword<T>(props: SmartInputFieldProps<T>) {
  const { className, fieldOptions } = props;
  const {
    control,
    value,
    required,
    disabled,
    label,
    setValue,
    markAsTouched,
    autoFocus,
    onChangePasswordStrength,
  } = useInputPassword(props);
  const id = useId();
  const [focus, setFocus] = useState(false);

  if (!control) return null;

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type="password"
        className={cn(INPUT_CLASSES, className)}
        value={value ?? ''}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => {
          setFocus(false);
          markAsTouched();
        }}
      />
      {!!fieldOptions?.possibilities?.strength && (
        <SmartPasswordStrength
          passwordToCheck={value ?? ''}
          showHint={focus}
          onPasswordStrength={onChangePasswordStrength}
        />
      )}
    </>
  );
}
