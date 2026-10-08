import { useId } from 'react';

import { useTranslate } from '../../../../providers/hooks';
import { cn } from '../../../../utils/class-names';
import { SmartButton } from '../../../button/button';
import { useInput } from '../../base/use-input';
import { useInputFile } from '../../base/use-input-file';
import { useInputFileDropZone } from '../../file/use-input-file-drop-zone';
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
].join(' ');

const DROP_ZONE_CLASSES = [
  'smart:cursor-pointer',
  'smart:p-12',
  'smart:flex',
  'smart:justify-center',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-dashed',
  'smart:rounded-xl',
  'smart:transition-colors',
  'smart:focus:outline-none',
  'smart:focus:ring-2',
  'smart:focus:ring-blue-600',
  'smart:dark:focus:ring-blue-500',
].join(' ');

const DROP_ZONE_DRAG_OVER_CLASSES = [
  'smart:border-blue-600',
  'smart:dark:border-blue-500',
  'smart:bg-blue-50',
  'smart:dark:bg-gray-700',
].join(' ');

const DROP_ZONE_IDLE_CLASSES = [
  'smart:border-gray-300',
  'smart:dark:border-gray-600',
].join(' ');

const PREVIEW_CLASSES = [
  'smart:p-3',
  'smart:flex',
  'smart:justify-between',
  'smart:items-center',
  'smart:gap-x-3',
  'smart:flex-wrap',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:rounded-xl',
].join(' ');

/**
 * Styled `attachment` field (preset, the Angular
 * `InputAttachmentPresetComponent`): a Preline drop zone ("drop file here or
 * browse") that opens the hidden file input on click / Enter / Space and
 * uploads a dropped file ({@link useInputFileDropZone}), a preview card with
 * the file name and the download / delete buttons, and the upload progress.
 * `className` is appended to the group's classes.
 */
export function SmartInputAttachmentPreset<T>(props: SmartInputFieldProps<T>) {
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
  const { dragOver, ...dropZoneHandlers } = useInputFileDropZone({
    control,
    inputRef,
    trigger: addButtonOptions.click,
  });
  const id = useId();

  if (!control) return null;

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div className={cn(GROUP_CLASSES, className)}>
        <div
          className={cn(
            DROP_ZONE_CLASSES,
            dragOver ? DROP_ZONE_DRAG_OVER_CLASSES : DROP_ZONE_IDLE_CLASSES,
          )}
          role="button"
          tabIndex={0}
          aria-disabled={loading ? true : undefined}
          {...dropZoneHandlers}
        >
          <div className="smart:text-center">
            <span className="smart:inline-flex smart:justify-center smart:items-center smart:size-16">
              <svg
                className="smart:shrink-0 smart:w-16 smart:text-gray-500 smart:dark:text-gray-400 smart:mx-auto"
                width="73"
                height="47"
                viewBox="0 0 73 47"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M54.519 40.4773V6.76876C54.519 3.92686 52.2121 1.62305 49.3664 1.62305H22.7076C19.8619 1.62305 17.555 3.92686 17.555 6.76876V40.4773M54.519 40.4773C54.519 43.3192 52.2121 45.6231 49.3664 45.6231H22.7076C19.8619 45.6231 17.555 43.3192 17.555 40.4773M54.519 40.4773L54.5189 34.6563L48.6564 28.3566L43.2612 34.6373C42.4421 35.5908 40.9662 35.5955 40.141 34.6472L30.3406 23.3844L17.555 36.9154V40.4773M6.20483 9.59424L17.707 7.6798V42.5188L12.6457 43.5828C9.25658 44.2954 5.94238 42.0892 5.29702 38.691L1.14643 16.8357C0.500082 13.4322 2.78322 10.1637 6.20483 9.59424ZM65.8691 9.59424L54.3669 7.6798V42.5188L59.4282 43.5828C62.8173 44.2954 66.1316 42.0892 66.7769 38.691L70.9274 16.8357C71.5738 13.4322 69.2907 10.1637 65.8691 9.59424ZM45.0584 15.3561C45.0584 17.7228 43.1372 19.6413 40.7673 19.6413C38.3974 19.6413 36.4762 17.7228 36.4762 15.3561C36.4762 12.9894 38.3974 11.0708 40.7673 11.0708C43.1372 11.0708 45.0584 12.9894 45.0584 15.3561Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </span>

            <div className="smart:mt-4 smart:flex smart:flex-wrap smart:justify-center smart:text-sm/6 smart:text-gray-500 smart:dark:text-gray-400">
              <span className="smart:pe-1 smart:font-medium smart:text-gray-900 smart:dark:text-white">
                {t('INPUT.dropFileHereOr')}
              </span>
              <span className="smart:font-semibold smart:text-blue-600 smart:dark:text-blue-400 smart:hover:text-blue-700 smart:dark:hover:text-blue-300 smart:underline">
                {t('browse')}
              </span>
            </div>
          </div>
        </div>

        {value && (
          <div className={PREVIEW_CLASSES}>
            <span className="smart:text-sm smart:font-medium smart:text-gray-900 smart:dark:text-white smart:truncate">
              {value.fileName}
            </span>
            <div className="smart:flex smart:items-center smart:gap-x-2 smart:flex-wrap">
              <SmartButton options={showButtonOptions}>
                {t('download')}
              </SmartButton>
              <SmartButton options={deleteButtonOptions}>
                {t('delete')}
              </SmartButton>
            </div>
          </div>
        )}

        {loading && (
          <div className="smart:flex smart:w-full smart:h-2 smart:bg-gray-100 smart:dark:bg-gray-800 smart:rounded-full smart:overflow-hidden">
            <div
              className="smart:h-full smart:bg-blue-600 smart:dark:bg-blue-500 smart:transition-all smart:duration-500"
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
