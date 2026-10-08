import { useId } from 'react';

import { IButtonOptions } from '../../../../models';
import { useTranslate } from '../../../../providers/hooks';
import { cn } from '../../../../utils/class-names';
import { SmartButton } from '../../../button/button';
import { useInputFileDropZone } from '../../file/use-input-file-drop-zone';
import { SmartInputFieldProps } from '../../input.types';
import { useInputVideo } from '../use-input-video';

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
  'smart:p-8',
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
 * Styled `video` field (preset, the Angular `InputVideoPresetComponent`): a
 * Preline drop zone ("drop file here or browse") that opens the hidden
 * `.mp4` input on click / Enter / Space and uploads a dropped file
 * ({@link useInputFileDropZone}), a preview card with the file name and the
 * play / delete buttons, the upload progress and a framed player
 * ({@link useInputVideo}). `className` is appended to the group's classes.
 */
export function SmartInputVideoPreset<T>(props: SmartInputFieldProps<T>) {
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
    url,
    play,
    onPlay,
  } = useInputVideo(props);
  const { dragOver, ...dropZoneHandlers } = useInputFileDropZone({
    control,
    inputRef,
    trigger: addButtonOptions.click,
  });
  const id = useId();

  if (!control) return null;

  const playButtonOptions: IButtonOptions = {
    click: onPlay,
    loading,
    variant: 'secondary',
    color: 'gray',
  };

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES} data-role="label">
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
            <span className="smart:inline-flex smart:justify-center smart:items-center smart:size-12 smart:text-gray-500 smart:dark:text-gray-400">
              <svg
                className="smart:shrink-0 smart:size-8"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 8-6 4 6 4V8Z" />
                <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
              </svg>
            </span>

            <div className="smart:mt-2 smart:flex smart:flex-wrap smart:justify-center smart:text-sm/6 smart:text-gray-500 smart:dark:text-gray-400">
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
              {!play && (
                <SmartButton options={playButtonOptions}>
                  {t('play')}
                </SmartButton>
              )}
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

        {url && play && (
          <video
            className="smart:w-full smart:rounded-xl smart:border smart:border-gray-200 smart:dark:border-gray-700"
            controls
            controlsList="nodownload"
          >
            <source type="video/mp4" src={url} />
          </video>
        )}

        <input
          id={id}
          ref={inputRef}
          type="file"
          accept=".mp4"
          hidden
          onChange={onFileChange}
        />
      </div>
    </>
  );
}
