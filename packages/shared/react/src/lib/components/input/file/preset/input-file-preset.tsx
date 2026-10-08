import { useId } from 'react';

import { useTranslate } from '../../../../providers/hooks';
import { cn } from '../../../../utils/class-names';
import { SmartButton } from '../../../button/button';
import { useInput } from '../../base/use-input';
import { useInputFile } from '../../base/use-input-file';
import { SmartInputFieldProps } from '../../input.types';

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
  'smart:flex-col',
  'smart:gap-y-2',
  'smart:w-full',
  'smart:max-w-sm',
].join(' ');

const INPUT_CLASSES = [
  // Preline default file input look (FRA-261)
  'smart:block',
  'smart:w-full',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:rounded-lg',
  'smart:text-sm',
  'smart:text-gray-900',
  'smart:dark:text-white',
  'smart:placeholder:text-gray-500',
  'smart:dark:placeholder:text-gray-400',
  'smart:focus:z-10',
  'smart:focus:outline-none',
  'smart:focus:border-blue-600',
  'smart:dark:focus:border-blue-500',
  'smart:focus:ring-1',
  'smart:focus:ring-blue-600',
  'smart:dark:focus:ring-blue-500',
  'smart:disabled:opacity-50',
  'smart:disabled:pointer-events-none',
  // styled file-selector button
  'smart:file:bg-gray-100',
  'smart:dark:file:bg-gray-800',
  'smart:file:text-gray-700',
  'smart:dark:file:text-gray-200',
  'smart:file:border-0',
  'smart:file:me-4',
  'smart:file:py-3',
  'smart:file:px-4',
].join(' ');

/**
 * Styled `file` field (preset, the Angular `InputFilePresetComponent`): a
 * Preline native file input that uploads the picked file through the file
 * service ({@link useInputFile}), with download / delete buttons and the
 * attachment's file name once there is a value, and the upload progress.
 * `className` is appended to the input's classes.
 */
export function SmartInputFilePreset<T>(props: SmartInputFieldProps<T>) {
  const { className, fieldOptions } = props;
  const t = useTranslate();
  const { control, value, required, label, autoFocus } = useInput(props);
  const {
    inputRef,
    loading,
    percent,
    onFileChange,
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
      <div className={GROUP_CLASSES}>
        <input
          id={id}
          ref={inputRef}
          type="file"
          className={cn(INPUT_CLASSES, className)}
          accept={fieldOptions?.possibilities}
          autoFocus={autoFocus}
          onChange={onFileChange}
        />
        {value && (
          <div className="smart:flex smart:items-center smart:gap-x-2 smart:flex-wrap">
            <SmartButton options={showButtonOptions}>
              {t('download')}
            </SmartButton>
            <SmartButton options={deleteButtonOptions}>
              {t('delete')}
            </SmartButton>
            <span className="smart:text-sm smart:text-gray-700 smart:dark:text-gray-300">
              {value.fileName}
            </span>
          </div>
        )}
        {loading && (
          <div className="smart:h-1 smart:w-full smart:overflow-hidden smart:rounded smart:bg-gray-200 smart:dark:bg-gray-700">
            <div
              className="smart:h-full smart:bg-blue-600 smart:dark:bg-blue-500"
              style={{ width: `${percent ?? 0}%` }}
            />
          </div>
        )}
      </div>
    </>
  );
}
