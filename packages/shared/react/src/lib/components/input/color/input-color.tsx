import { useId } from 'react';

import { cn } from '../../../utils/class-names';
import { SmartInputFieldProps } from '../input.types';
import { useInputColor } from './use-input-color';

const LABEL_CLASSES =
  'smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white';

/**
 * The colour field (`<smart-input-color>`, Angular `InputColorComponent`): a
 * swatch of the colour, a picker and a `×` button that clears it. Angular
 * opened the `ngx-color-picker` popup on the input; this uses the browser's
 * native `<input type="color">` instead.
 */
export function SmartInputColor<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const id = useId();
  const { control, required, label, color, selectColor, clear } =
    useInputColor(props);

  if (!control) return null;

  return (
    <>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div
        className={cn(
          'smart:mt-2 smart:flex smart:items-center smart:gap-x-2',
          className,
        )}
      >
        <span
          className="smart:inline-block smart:h-8 smart:w-8 smart:rounded smart:border smart:border-gray-300 smart:dark:border-gray-600"
          style={color ? { background: color } : undefined}
        />
        <input
          id={id}
          type="color"
          value={color || '#000000'}
          onChange={(e) => selectColor(e.target.value)}
          className="smart:h-8 smart:w-8 smart:cursor-pointer smart:rounded smart:border-0 smart:bg-transparent"
        />
        <button
          type="button"
          onClick={clear}
          className="smart:rounded-md smart:bg-red-600 smart:px-2 smart:py-1 smart:text-xs smart:font-semibold smart:text-white smart:hover:bg-red-500"
        >
          ×
        </button>
      </div>
    </>
  );
}
