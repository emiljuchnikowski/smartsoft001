import { useEffect, useState } from 'react';

import { SmartAbstractControl } from '../../../forms/abstract-control';
import { useSmart } from '../../../providers/smart-context';
import { FileService } from '../../../services/file/file.service';
import { useInput } from '../base/use-input';
import { useInputFile } from '../base/use-input-file';
import { SmartInputFieldProps } from '../input.types';

/** How long the preview waits for the value to settle (`debounceTime(1000)`). */
const IMAGE_DEBOUNCE_TIME = 1000;

function getImageUrl(
  control: SmartAbstractControl | null,
  fileService: FileService | null,
): string | null {
  return control?.value
    ? (fileService?.getUrl(control.value.id) ?? null)
    : null;
}

/**
 * {@link useInput} and {@link useInputFile} plus the preview of the image
 * fields (the `imageUrl` of the Angular `InputImageComponent` and the logo
 * preset): the URL of the attachment in the value, set at once and then
 * again a second after the value stops changing.
 */
export function useInputImage<T>(props: SmartInputFieldProps<T>) {
  const input = useInput(props);
  const file = useInputFile(props);
  const { fileService } = useSmart();
  const { control } = input;
  const [imageUrl, setImageUrl] = useState<string | null>(() =>
    getImageUrl(control, fileService),
  );

  useEffect(() => {
    if (!control) return undefined;

    setImageUrl(getImageUrl(control, fileService));

    let timer: ReturnType<typeof setTimeout> | undefined;
    const subscription = control.valueChanges.subscribe(() => {
      clearTimeout(timer);
      timer = setTimeout(
        () => setImageUrl(getImageUrl(control, fileService)),
        IMAGE_DEBOUNCE_TIME,
      );
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [control, fileService]);

  return { ...input, ...file, imageUrl };
}
