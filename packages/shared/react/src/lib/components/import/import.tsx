import { useMemo } from 'react';

import { SmartImportProps } from './import.types';
import { useImport } from './use-import';
import { IButtonOptions } from '../../models';
import { SmartButton } from '../button/button';

/**
 * An upload-icon `SmartButton` that opens a hidden file input and passes the
 * picked file to `onSet`.
 *
 * `className` goes on a `<span>`, an inline box around the button and the
 * input.
 */
export function SmartImport(props: SmartImportProps) {
  const { accept = 'application/json', className } = props;
  const { inputRef, onFileSelected, triggerFileInput } = useImport(props);

  const buttonOptions = useMemo<IButtonOptions>(
    () => ({
      click: () => {
        const inputEl = inputRef.current;
        if (inputEl) {
          triggerFileInput(inputEl);
        }
      },
    }),
    [inputRef, triggerFileInput],
  );

  return (
    <span className={className || undefined}>
      <SmartButton options={buttonOptions}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="smart:size-5"
        >
          <path d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z" />
          <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
        </svg>
      </SmartButton>
      <input
        type="file"
        accept={accept}
        hidden
        onChange={onFileSelected}
        ref={inputRef}
      />
    </span>
  );
}
