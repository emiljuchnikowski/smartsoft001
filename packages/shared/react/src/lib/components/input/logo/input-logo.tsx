import { useId, useRef } from 'react';
import type { ChangeEvent } from 'react';

import { cn } from '../../../utils/class-names';
import { useInput } from '../base/use-input';
import { SmartInputFieldProps } from '../input.types';

const LABEL_CLASSES = [
  'smart:block',
  'smart:text-sm/6',
  'smart:font-medium',
  'smart:text-gray-900',
  'smart:dark:text-white',
].join(' ');

/**
 * The `logo` field. It does not upload: the picked image is read in the browser
 * and stored as a `data:image/jpeg;base64, ...` URL (with the space after the
 * comma). Without a value a "Wybierz plik" button (not translated) opens the
 * hidden input; with one, the image opens it and "×" clears the value.
 * `className` is appended to the group's classes.
 */
export function SmartInputLogo<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const { control, value, required, label } = useInput(props);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  if (!control) return null;

  const set = () => inputRef.current?.click();

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Let the same file be picked again.
    event.target.value = '';

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryData = e.target?.result;
      const base64String = window.btoa(binaryData as string);

      control.markAsDirty();
      control.markAsTouched();
      control.setValue('data:image/jpeg;base64, ' + base64String);
    };

    reader.readAsBinaryString(file);
  };

  const clear = () => {
    control.markAsDirty();
    control.markAsTouched();
    control.setValue(null);
  };

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div
        className={cn(
          'smart:mt-2 smart:flex smart:items-center smart:gap-x-3',
          className,
        )}
      >
        {value ? (
          <>
            <img
              src={value}
              onClick={set}
              className="smart:h-20 smart:w-20 smart:cursor-pointer smart:rounded smart:border smart:border-gray-300 smart:object-cover smart:dark:border-gray-600"
            />
            <button
              type="button"
              onClick={clear}
              className="smart:rounded-md smart:bg-red-600 smart:px-2 smart:py-1 smart:text-xs smart:font-semibold smart:text-white smart:hover:bg-red-500"
            >
              ×
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={set}
            className="smart:rounded-md smart:bg-indigo-600 smart:px-3 smart:py-2 smart:text-sm smart:font-semibold smart:text-white smart:hover:bg-indigo-500"
          >
            Wybierz plik
          </button>
        )}
        <input
          id={id}
          ref={inputRef}
          hidden
          accept="image/jpeg"
          type="file"
          onChange={onFileChange}
        />
      </div>
    </>
  );
}
