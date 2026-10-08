import { useId } from 'react';

import { useTranslate } from '../../../../providers/hooks';
import { cn } from '../../../../utils/class-names';
import { SmartInputFieldProps } from '../../input.types';
import { useInputRadio } from '../use-input-radio';

const LEGEND_CLASSES =
  'smart:block smart:text-sm smart:font-medium smart:text-gray-900 smart:dark:text-white';

const RADIO_CLASSES =
  'smart:shrink-0 smart:size-4 smart:bg-transparent smart:border-gray-300 smart:dark:border-gray-600 smart:rounded-full smart:shadow-2xs smart:text-blue-600 smart:dark:text-blue-400 smart:focus:ring-0 smart:focus:ring-offset-0 smart:checked:bg-blue-700 smart:dark:checked:bg-blue-600 smart:checked:border-blue-700 smart:dark:checked:border-blue-600 smart:disabled:opacity-50 smart:disabled:pointer-events-none';

const ITEM_LABEL_CLASSES =
  'smart:text-sm smart:ms-3 smart:text-gray-500 smart:dark:text-gray-400';

/**
 * Styled radio field (preset, Angular `InputRadioPresetComponent`): Preline
 * radios in a column, the first one autofocused when the field is
 * `focused`. Each label is bound to its radio by `htmlFor`.
 */
export function SmartInputRadioPreset<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const t = useTranslate();
  const id = useId();
  const {
    control,
    value,
    required,
    disabled,
    label,
    fieldKey,
    possibilities,
    autoFocus,
    setValue,
    markAsTouched,
  } = useInputRadio(props);

  if (!control) return null;

  return (
    <fieldset>
      <legend className={LEGEND_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ms-0.5">*</span>}
      </legend>
      <div
        className={cn(
          'smart:mt-2',
          'smart:flex',
          'smart:flex-col',
          'smart:gap-y-3',
          className,
        )}
      >
        {possibilities?.map((item, index) => (
          <div key={index} className="smart:flex smart:items-center">
            <input
              id={id + '-' + index}
              type="radio"
              name={fieldKey}
              value={String(item.id)}
              checked={item.id === value}
              disabled={disabled}
              autoFocus={index === 0 && autoFocus}
              onChange={() => setValue(item.id)}
              onBlur={markAsTouched}
              className={RADIO_CLASSES}
            />
            <label htmlFor={id + '-' + index} className={ITEM_LABEL_CLASSES}>
              {t(item.text)}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
