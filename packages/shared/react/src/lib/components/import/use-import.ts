import { useCallback, useRef } from 'react';

import { SmartImportProps } from './import.types';

/**
 * The Angular `ImportBaseComponent`: `onFileSelected` hands the picked file
 * to `onSet` and clears the input, so picking the same file again fires
 * `change` again; `triggerFileInput` opens the picker of `inputEl`.
 */
export function useImport({ onSet }: Pick<SmartImportProps, 'onSet'>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileSelected = useCallback(
    (event: { target: HTMLInputElement }): void => {
      const inputEl = event.target;
      const file: File | null = inputEl.files?.[0] ?? null;

      inputEl.value = '';

      if (file) {
        onSet?.(file);
      } else {
        throw Error('ImportBaseComponent: File not found');
      }
    },
    [onSet],
  );

  const triggerFileInput = useCallback((inputEl: HTMLInputElement): void => {
    inputEl.click();
  }, []);

  return { inputRef, onFileSelected, triggerFileInput };
}
