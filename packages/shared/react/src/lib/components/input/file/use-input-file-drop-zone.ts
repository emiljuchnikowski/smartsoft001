import { useState } from 'react';
import type { DragEvent, KeyboardEvent, RefObject } from 'react';

import { SmartAbstractControl } from '../../../forms/abstract-control';

export interface UseInputFileDropZoneOptions {
  control: SmartAbstractControl | null;
  /** The hidden file input the dropped files are handed to. */
  inputRef: RefObject<HTMLInputElement | null>;
  /** Opens the file picker: the `addButtonOptions.click` of `useInputFile`. */
  trigger: () => void;
}

/**
 * The Preline-style drop zone of the `pdf`, `video` and `attachment` presets: a
 * click, Enter or Space opens the file picker, a dragged file highlights the
 * zone (`dragOver`), and a drop hands the files to the hidden input and fires
 * its `change`, so the upload of `useInputFile` runs as for a picked file.
 */
export function useInputFileDropZone({
  control,
  inputRef,
  trigger,
}: UseInputFileDropZoneOptions) {
  const [dragOver, setDragOver] = useState(false);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      trigger();
    } else if (event.key === ' ') {
      trigger();
      event.preventDefault();
    }
  };

  const onDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const onDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragOver(false);

    const input = inputRef.current;
    const files = event.dataTransfer?.files;
    if (!input || !files || files.length === 0) return;

    // Hand the dropped files to the hidden <input> and reuse its 'change'
    // wiring. It bubbles so React's `onChange` sees it.
    input.files = files;
    control?.markAsDirty();
    control?.markAsTouched();
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  return {
    dragOver,
    onClick: trigger,
    onKeyDown,
    onDragOver,
    onDragLeave,
    onDrop,
  };
}
