import { useId } from 'react';

import { useTranslate } from '../../../../providers/hooks';
import { cn } from '../../../../utils/class-names';
import { SmartButton } from '../../../button/button';
import { SmartInputFieldProps } from '../../input.types';
import { useInputImage } from '../use-input-image';

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

const IMAGE_CLASSES = [
  // Preline image preview (FRA-263): w-56 h-auto + card-style framing
  'smart:w-56',
  'smart:h-auto',
  'smart:rounded-lg',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
].join(' ');

/**
 * Styled `image` field (preset, the Angular `InputImagePresetComponent`):
 * the behaviour of {@link SmartInputImage} with a Preline card-style image
 * preview and a blue progress bar. `className` is appended to the group's
 * classes.
 */
export function SmartInputImagePreset<T>(props: SmartInputFieldProps<T>) {
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
              className="smart:h-full smart:bg-blue-600 smart:dark:bg-blue-500"
              style={{ width: `${percent ?? 0}%` }}
            />
          </div>
        )}
        {imageUrl && <img src={imageUrl} className={IMAGE_CLASSES} alt="" />}
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
