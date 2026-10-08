import { useId } from 'react';

import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { SmartInputFieldProps } from '../input.types';
import { useInputVideo } from './use-input-video';

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
 * The `video` field (the Angular `InputVideoComponent`,
 * `<smart-input-video>`): plain add / change, play and delete buttons (they
 * run the button options directly, so delete asks no confirmation, as in
 * Angular), a hidden `.mp4` input whose file is uploaded, the upload
 * progress and the player ({@link useInputVideo}). `className` is appended
 * to the group's classes.
 */
export function SmartInputVideo<T>(props: SmartInputFieldProps<T>) {
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
  const id = useId();

  if (!control) return null;

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div className={cn(GROUP_CLASSES, className)}>
        <button
          type="button"
          onClick={() => addButtonOptions.click()}
          className="smart:rounded-md smart:bg-indigo-600 smart:px-3 smart:py-1.5 smart:text-sm smart:font-semibold smart:text-white smart:hover:bg-indigo-500"
        >
          {t(value ? 'change' : 'add')}
        </button>
        {value && !play && (
          <button
            type="button"
            onClick={onPlay}
            className="smart:rounded-md smart:bg-gray-200 smart:px-3 smart:py-1.5 smart:text-sm smart:font-semibold smart:text-gray-900 smart:hover:bg-gray-300 smart:dark:bg-white/10 smart:dark:text-white"
          >
            {t('play')}
          </button>
        )}
        {value && (
          <button
            type="button"
            onClick={() => deleteButtonOptions.click()}
            className="smart:rounded-md smart:bg-red-600 smart:px-3 smart:py-1.5 smart:text-sm smart:font-semibold smart:text-white smart:hover:bg-red-500"
          >
            {t('delete')}
          </button>
        )}
        {loading && (
          <div className="smart:h-1 smart:w-24 smart:overflow-hidden smart:rounded smart:bg-gray-200 smart:dark:bg-gray-700">
            <div
              className="smart:h-full smart:bg-indigo-600"
              style={{ width: `${percent ?? 0}%` }}
            />
          </div>
        )}
        {url && play && (
          <video className="smart:w-full" controls controlsList="nodownload">
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
