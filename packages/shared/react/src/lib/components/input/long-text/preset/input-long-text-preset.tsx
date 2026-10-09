import { useId } from 'react';

import { useTranslate } from '../../../../providers/hooks';
import { cn } from '../../../../utils/class-names';
import { useInput } from '../../base/use-input';
import { SmartInputFieldProps } from '../../input.types';

const LABEL_CLASSES =
  'smart:block smart:mb-3 smart:text-sm smart:font-medium smart:text-gray-900 smart:dark:text-white';

const TEXTAREA_CLASSES = [
  'smart:py-2',
  'smart:px-3',
  'smart:sm:py-3',
  'smart:sm:px-4',
  'smart:block',
  'smart:w-full',
  'smart:rounded-lg',
  'smart:border',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:sm:text-sm',
  'smart:text-gray-900',
  'smart:dark:text-white',
  'smart:placeholder:text-gray-500',
  'smart:dark:placeholder:text-gray-400',
  'smart:focus:border-blue-700',
  'smart:dark:focus:border-blue-600',
  'smart:focus:ring-blue-700',
  'smart:dark:focus:ring-blue-600',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
  'smart:[&::-webkit-scrollbar]:w-2',
  'smart:[&::-webkit-scrollbar-thumb]:rounded-none',
  'smart:[&::-webkit-scrollbar-track]:bg-gray-100',
  'smart:dark:[&::-webkit-scrollbar-track]:bg-gray-800',
  'smart:[&::-webkit-scrollbar-thumb]:bg-gray-300',
  'smart:dark:[&::-webkit-scrollbar-thumb]:bg-gray-600',
];

/**
 * Preline-styled long text field (preset). Unlike `SmartInputLongText` (the
 * rich-text editor), this renders a plain `<textarea>` (FRA-267), so the value
 * is plain text.
 */
export function SmartInputLongTextPreset<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const id = useId();
  const t = useTranslate();
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
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <textarea
        id={id}
        rows={3}
        className={cn(TEXTAREA_CLASSES, className)}
        placeholder={t('writeHere') + '...'}
        value={value ?? ''}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        onBlur={markAsTouched}
      />
    </>
  );
}
