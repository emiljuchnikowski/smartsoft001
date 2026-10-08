import { useId } from 'react';

import { cn } from '../../../../utils/class-names';
import { SmartInputFieldProps } from '../../input.types';
import { useInputColor } from '../use-input-color';

const LABEL_CLASSES =
  'smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white';

const FRAME_CLASSES = [
  'smart:mt-2',
  'smart:flex',
  'smart:items-center',
  'smart:gap-x-3',
  'smart:p-2',
  'smart:bg-white',
  'smart:dark:bg-gray-800',
  'smart:border',
  'smart:border-gray-200',
  'smart:dark:border-gray-700',
  'smart:rounded-lg',
  'smart:focus-within:ring-1',
  'smart:focus-within:ring-blue-500',
  'smart:dark:focus-within:ring-blue-600',
];

const SWATCH_CLASSES =
  'smart:inline-block smart:size-8 smart:rounded-md smart:border smart:border-gray-200 smart:dark:border-gray-700';

const PICKER_CLASSES =
  'smart:size-8 smart:cursor-pointer smart:rounded-md smart:border-0 smart:bg-transparent';

const HEX_CLASSES =
  'smart:flex-1 smart:text-sm smart:font-medium smart:text-gray-900 smart:dark:text-white smart:uppercase';

const CLEAR_CLASSES =
  'smart:rounded-md smart:bg-red-600 smart:px-2 smart:py-1 smart:text-xs smart:font-semibold smart:text-white smart:hover:bg-red-500';

/**
 * Preline-styled colour field (preset): a framed swatch (white without a
 * colour), the native colour picker, the colour's hex code and a clear button.
 */
export function SmartInputColorPreset<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const id = useId();
  const { control, required, label, color, selectColor, clear } =
    useInputColor(props);

  if (!control) return null;

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES} data-role="label">
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div className={cn(FRAME_CLASSES, className)} data-role="color-frame">
        <span
          className={SWATCH_CLASSES}
          style={{ background: color || '#ffffff' }}
          data-role="swatch"
        />
        <input
          id={id}
          type="color"
          value={color || '#000000'}
          onChange={(e) => selectColor(e.target.value)}
          className={PICKER_CLASSES}
          data-role="color-input"
        />
        <span className={HEX_CLASSES} data-role="hex">
          {color || ''}
        </span>
        <button
          type="button"
          onClick={clear}
          className={CLEAR_CLASSES}
          data-role="clear"
        >
          ×
        </button>
      </div>
    </>
  );
}
