import { useCallback, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';

import { IButtonOptions } from '../../../models';
import { useSmart } from '../../../providers/smart-context';
import { SmartInputFieldProps } from '../input.types';

/**
 * The upload behaviour of the file fields (the Angular
 * `InputFileBaseComponent`): picking a file checks it against the input's
 * `accept` list, uploads it through the file service with progress, and sets
 * the attachment the API returns as the value. Also the options of the add,
 * show and delete buttons the file fields render.
 */
export function useInputFile<T = any>({ options }: SmartInputFieldProps<T>) {
  const { fileService, toastService, translate } = useSmart();
  const control = options?.control ?? null;
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState<number | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);

  const onFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const element = event.target;
      const picked = element.files?.[0] ?? null;

      // Let the same file be picked again after a failure or a delete.
      element.value = '';
      setLoading(true);
      setFile(picked);

      if (element.accept && picked && picked.name) {
        const acceptTypes = element.accept
          .split(',')
          .map((type) => type.trim().replace('.', '').toLowerCase());
        const fileType = picked.name
          .substring(picked.name.lastIndexOf('.') + 1)
          .toLowerCase();

        if (!acceptTypes.some((a) => a === fileType)) {
          toastService.error({
            duration: 3000,
            message:
              translate('INPUT.ERRORS.invalidFileType') +
              ` (${element.accept})`,
          });
          setLoading(false);
          return;
        }
      }

      if (!picked || !fileService) {
        setLoading(false);
        return;
      }

      fileService
        .upload(picked, setPercent)
        .then((result) => control?.setValue(result))
        .catch(() => toastService.error({ message: translate('ERRORS.other') }))
        .finally(() => setLoading(false));
    },
    [control, fileService, toastService, translate],
  );

  const addButtonOptions: IButtonOptions = {
    click: () => {
      control?.markAsDirty();
      control?.markAsTouched();
      inputRef.current?.click();
    },
    loading,
    variant: 'primary',
  };

  const showButtonOptions: IButtonOptions = {
    click: () => {
      if (control?.value?.id) fileService?.download(control.value.id);
    },
    loading,
    variant: 'secondary',
    color: 'gray',
  };

  const deleteButtonOptions: IButtonOptions = {
    click: () => {
      control?.markAsDirty();
      control?.markAsTouched();
      control?.setValue(null);
      setFile(null);
    },
    loading,
    confirm: true,
    variant: 'primary',
    color: 'red',
  };

  return {
    inputRef,
    loading,
    percent,
    file,
    onFileChange,
    addButtonOptions,
    showButtonOptions,
    deleteButtonOptions,
  };
}
