import { useId } from 'react';

import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { SmartButton } from '../../button/button';
import { useInput } from '../base/use-input';
import { useInputFile } from '../base/use-input-file';
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
  'smart:flex-wrap',
].join(' ');

/**
 * The `attachment` field: an add / change button opening a hidden file input
 * (`accept` = `fieldOptions.possibilities`) whose file is uploaded
 * ({@link useInputFile}), download / delete buttons and the file name once
 * there is a value, and the upload progress. `className` is appended to the
 * group's classes.
 */
export function SmartInputAttachment<T>(props: SmartInputFieldProps<T>) {
  const { className, fieldOptions } = props;
  const t = useTranslate();
  const { control, value, required, label } = useInput(props);
  const {
    inputRef,
    loading,
    percent,
    onFileChange,
    addButtonOptions,
    showButtonOptions,
    deleteButtonOptions,
  } = useInputFile(props);
  const id = useId();

  if (!control) return null;

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
        {value && (
          <>
            <SmartButton options={showButtonOptions}>
              {t('download')}
            </SmartButton>
            <SmartButton options={deleteButtonOptions}>
              {t('delete')}
            </SmartButton>
            <span className="smart:text-sm smart:text-gray-700 smart:dark:text-gray-300">
              {value.fileName}
            </span>
          </>
        )}
        {loading && (
          <div className="smart:h-1 smart:w-24 smart:overflow-hidden smart:rounded smart:bg-gray-200 smart:dark:bg-gray-700">
            <div
              className="smart:h-full smart:bg-indigo-600"
              style={{ width: `${percent ?? 0}%` }}
            />
          </div>
        )}
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept={fieldOptions?.possibilities}
          hidden
          onChange={onFileChange}
        />
      </div>
    </>
  );
}
