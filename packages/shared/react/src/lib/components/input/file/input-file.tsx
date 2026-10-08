import { useId, useRef } from 'react';
import type { ChangeEvent } from 'react';

import { IButtonOptions } from '../../../models';
import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { SmartButton } from '../../button/button';
import { useInput } from '../base/use-input';
import { SmartInputFieldProps } from '../input.types';

const LABEL_CLASSES = [
  'smart:block',
  'smart:text-sm/6',
  'smart:font-medium',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

const GROUP_CLASSES = [
  'smart:mt-2',
  'smart:flex',
  'smart:items-center',
  'smart:gap-x-2',
].join(' ');

/**
 * The `file` field (the Angular `InputFileComponent`, `<smart-input-file>`):
 * the model label, an add / change button opening a hidden file input, and
 * the name of the value. Unlike the other file fields it does not upload:
 * the picked `File` itself becomes the value. `className` is appended to the
 * group's classes.
 */
export function SmartInputFile<T>(props: SmartInputFieldProps<T>) {
  const { className, fieldOptions } = props;
  const t = useTranslate();
  const { control, value, required, label, autoFocus } = useInput(props);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  if (!control) return null;

  const addButtonOptions: IButtonOptions = {
    variant: 'primary',
    click: () => {
      control.markAsDirty();
      control.markAsTouched();
      inputRef.current?.click();
    },
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Let the same file be picked again.
    event.target.value = '';

    control.setValue(file);
    control.updateValueAndValidity();
  };

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div className={cn(GROUP_CLASSES, className)}>
        <SmartButton options={addButtonOptions}>
          {t(value ? 'change' : 'add')}
        </SmartButton>
        {value?.name && (
          <span className="smart:text-sm smart:text-gray-700 smart:dark:text-gray-300">
            {value.name}
          </span>
        )}
        <input
          id={id}
          ref={inputRef}
          type="file"
          hidden
          accept={fieldOptions?.possibilities}
          autoFocus={autoFocus}
          onChange={onFileChange}
        />
      </div>
    </>
  );
}
