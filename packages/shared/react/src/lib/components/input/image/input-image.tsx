import { useId } from 'react';

import { useInputImage } from './use-input-image';
import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { SmartButton } from '../../button/button';
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
 * The `image` field: an add / change button opening a hidden `.jpg,.png,.jpeg`
 * input whose file is uploaded, a delete button and the preview of the uploaded
 * image ({@link useInputImage}), and the upload progress. `className` is
 * appended to the group's classes.
 */
export function SmartInputImage<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const t = useTranslate();
  const {
    control,
    value,
    required,
    label,
    inputRef,
    loading,
    percent,
    onFileChange,
    addButtonOptions,
    deleteButtonOptions,
    imageUrl,
  } = useInputImage(props);
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
          <SmartButton options={deleteButtonOptions}>{t('delete')}</SmartButton>
        )}
        {loading && (
          <div className="smart:h-1 smart:w-24 smart:overflow-hidden smart:rounded smart:bg-gray-200 smart:dark:bg-gray-700">
            <div
              className="smart:h-full smart:bg-indigo-600"
              style={{ width: `${percent ?? 0}%` }}
            />
          </div>
        )}
        {imageUrl && (
          <img
            src={imageUrl}
            className="smart:max-h-96 smart:max-w-full smart:rounded smart:border smart:border-gray-300 smart:dark:border-gray-600"
          />
        )}
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept=".jpg,.png,.jpeg"
          hidden
          onChange={onFileChange}
        />
      </div>
    </>
  );
}
