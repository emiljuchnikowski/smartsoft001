import { useId, useLayoutEffect, useMemo, useRef } from 'react';

import { useTranslate } from '../../../../providers/hooks';
import { cn } from '../../../../utils/class-names';
import { useInput } from '../../base/use-input';
import { useInputPossibilities } from '../../base/use-input-possibilities';
import { SmartInputFieldProps } from '../../input.types';
import { getModelFieldPossibilitiesList } from '../../radio/use-input-radio';

const LABEL_CLASSES =
  'smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white';

const SELECT_CLASSES = [
  'smart:mt-2',
  'smart:block',
  'smart:w-full',
  'smart:py-2.5',
  'smart:sm:py-3',
  'smart:px-4',
  'smart:pe-9',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:rounded-lg',
  'smart:sm:text-sm',
  'smart:text-gray-900',
  'smart:dark:text-white',
  'smart:focus:border-blue-700',
  'smart:dark:focus:border-blue-600',
  'smart:focus:ring-blue-700',
  'smart:dark:focus:ring-blue-600',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
];

/**
 * Styled enum field (preset): a Preline select with one option per possibility
 * (from the provider, the input options, or the object map of the model field's
 * `possibilities`); the control holds the chosen possibility's `id`, of any
 * type. No option is selected while the value matches none.
 */
export function SmartInputEnumPreset<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const t = useTranslate();
  const id = useId();
  const selectRef = useRef<HTMLSelectElement>(null);
  const {
    control,
    value,
    required,
    disabled,
    label,
    model,
    fieldKey,
    autoFocus,
    setValue,
    markAsTouched,
  } = useInput(props);
  const fromInput = useInputPossibilities(props);
  const fromModel = useMemo(
    () => getModelFieldPossibilitiesList(model, fieldKey),
    [model, fieldKey],
  );
  const possibilities = fromInput ?? fromModel;
  const selectedIndex =
    possibilities?.findIndex((item) => Object.is(item.id, value)) ?? -1;

  // The select is not controlled by React, which would show the first option
  // for a value no option has.
  useLayoutEffect(() => {
    if (selectRef.current) selectRef.current.selectedIndex = selectedIndex;
  }, [selectedIndex, possibilities]);

  if (!control) return null;

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES} data-role="label">
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <select
        ref={selectRef}
        id={id}
        className={cn(SELECT_CLASSES, className)}
        disabled={disabled}
        autoFocus={autoFocus}
        data-role="select"
        onChange={(event) => {
          const item = possibilities?.[event.target.selectedIndex];

          if (item) setValue(item.id);
        }}
        onBlur={markAsTouched}
      >
        {possibilities?.map((item, index) => (
          <option key={index} value={String(index)}>
            {t(item.text)}
          </option>
        ))}
      </select>
    </>
  );
}
