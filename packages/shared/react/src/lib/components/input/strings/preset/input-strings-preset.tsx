import { useId, useState } from 'react';
import type { SyntheticEvent } from 'react';

import { useTranslate } from '../../../../providers/hooks';
import { cn } from '../../../../utils/class-names';
import { useInput } from '../../base/use-input';
import { SmartInputFieldProps } from '../../input.types';

const LABEL_CLASSES =
  'smart:block smart:text-sm smart:font-medium smart:mb-2 smart:text-gray-800 smart:dark:text-gray-200';

// Preline "soft" badge chip look (gray).
const CHIP_CLASSES =
  'smart:inline-flex smart:items-center smart:gap-x-1.5 smart:py-1.5 smart:px-3 smart:rounded-full smart:text-xs smart:font-medium smart:bg-gray-100 smart:text-gray-800 smart:dark:bg-gray-500/20 smart:dark:text-gray-300';

const REMOVE_CLASSES =
  'smart:group smart:relative smart:-mr-1 smart:ml-0.5 smart:inline-flex smart:items-center smart:justify-center smart:size-4 smart:rounded-full smart:leading-none smart:text-gray-500 smart:dark:text-gray-400 smart:hover:bg-black/10 smart:dark:hover:bg-white/20';

const INPUT_CLASSES =
  'smart:py-2.5 smart:sm:py-3 smart:px-4 smart:block smart:w-full smart:bg-white smart:dark:bg-gray-800 smart:border smart:border-gray-200 smart:dark:border-gray-700 smart:rounded-lg smart:sm:text-sm smart:text-gray-900 smart:dark:text-white smart:placeholder:text-gray-500 smart:dark:placeholder:text-gray-400 smart:focus:border-blue-600 smart:dark:focus:border-blue-500 smart:focus:ring-1 smart:focus:ring-blue-600 smart:dark:focus:ring-blue-500 smart:disabled:opacity-50 smart:disabled:pointer-events-none';

/**
 * Styled strings field (preset, Angular `InputStringsPresetComponent`): the
 * strings as Preline chips with a remove button, and an input that adds its
 * trimmed text on Enter (without submitting the form) or when it is left.
 * Every change marks the control touched and dirty. The label is bound to the
 * add input.
 */
export function SmartInputStringsPreset<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const t = useTranslate();
  const id = useId();
  const { control, value, required, disabled, label, autoFocus } =
    useInput(props);
  const [draft, setDraft] = useState('');

  if (!control) return null;

  const values: string[] = Array.isArray(value) ? value : [];

  const sync = (next: string[]) => {
    control.markAsTouched();
    control.markAsDirty();
    control.setValue([...next]);
  };

  const addValue = (event?: SyntheticEvent) => {
    // Prevent the Enter key from submitting the surrounding form.
    event?.preventDefault();

    const raw = (draft ?? '').trim();
    if (!raw) return;

    setDraft('');
    sync([...values, raw]);
  };

  const removeValue = (index: number) => {
    if (index < 0 || index >= values.length) return;

    sync(values.filter((_, i) => i !== index));
  };

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div className={cn('smart:space-y-2', className)}>
        {values.length > 0 && (
          <div
            className="smart:flex smart:flex-wrap smart:gap-2"
            data-role="chips"
          >
            {values.map((item, index) => (
              <span key={index} className={CHIP_CLASSES} data-role="chip">
                {item}
                <button
                  type="button"
                  className={REMOVE_CLASSES}
                  disabled={disabled}
                  onClick={() => removeValue(index)}
                  aria-label={t('remove')}
                  data-role="remove"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </span>
            ))}
          </div>
        )}
        <input
          id={id}
          type="text"
          value={draft}
          placeholder={t('add') + '...'}
          className={INPUT_CLASSES}
          disabled={disabled}
          autoFocus={autoFocus}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (
              event.key === 'Enter' &&
              !event.altKey &&
              !event.ctrlKey &&
              !event.metaKey &&
              !event.shiftKey
            ) {
              addValue(event);
            }
          }}
          onBlur={() => addValue()}
          data-role="add-input"
        />
      </div>
    </>
  );
}
