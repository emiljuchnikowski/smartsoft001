import { useId } from 'react';

import {
  getInputNipPresetClasses,
  getInputNipPresetLabelClasses,
} from './preset-classes';
import { SmartInputFieldProps } from '../../input.types';
import { useInputNip } from '../use-input-nip';

/**
 * Styled `nip` field (preset): the Preline look of {@link SmartInputNip}, with
 * the same NIP check. Register it as `inputFieldComponents[FieldType.nip]` on
 * `SmartProvider`.
 */
export function SmartInputNipPreset<T>(props: SmartInputFieldProps<T>) {
  const { className = '' } = props;
  const {
    control,
    value,
    required,
    disabled,
    label,
    setValue,
    markAsTouched,
    autoFocus,
  } = useInputNip(props);
  const id = useId();

  if (!control) return null;

  return (
    <>
      <label htmlFor={id} className={getInputNipPresetLabelClasses()}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type="text"
        className={getInputNipPresetClasses(className)}
        value={value ?? ''}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        onBlur={markAsTouched}
      />
    </>
  );
}
