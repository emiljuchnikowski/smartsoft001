import { useTranslate } from '../../../../providers/hooks';
import { cn } from '../../../../utils/class-names';
import { toInnerHtml } from '../../../../utils/html';
import { SmartInputFieldProps } from '../../input.types';
import { useInputCheck } from '../use-input-check';

const LABEL_CLASSES =
  'smart:block smart:text-sm smart:font-medium smart:text-gray-900 smart:dark:text-white';

// Preline "Default checkbox" look translated to smart:-prefixed vanilla
// Tailwind with explicit dark: variants.
const CHECKBOX_CLASSES =
  'smart:shrink-0 smart:size-4 smart:bg-transparent smart:border-gray-200 smart:dark:border-gray-700 smart:rounded-sm smart:shadow-2xs smart:text-blue-600 smart:dark:text-blue-400 smart:focus:ring-0 smart:focus:ring-offset-0 smart:checked:bg-blue-700 smart:dark:checked:bg-blue-600 smart:checked:border-blue-700 smart:dark:checked:border-blue-600 smart:disabled:opacity-50 smart:disabled:pointer-events-none';

const OPTION_LABEL_CLASSES =
  'smart:text-sm smart:ms-3 smart:text-gray-500 smart:dark:text-gray-400';

/**
 * Styled check field (preset): Preline checkboxes, each followed by its
 * (translated) text rendered as sanitised HTML in a `<span>`.
 */
export function SmartInputCheckPreset<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const t = useTranslate();
  const { control, required, disabled, label, possibilities, toggle } =
    useInputCheck(props);

  if (!control) return null;

  return (
    <fieldset>
      <legend className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ms-0.5">*</span>}
      </legend>
      <div
        className={cn('smart:mt-2', 'smart:space-y-3', className)}
        data-role="check-group"
      >
        {possibilities?.map((item, index) => (
          <div key={index} className="smart:flex smart:items-center">
            <input
              type="checkbox"
              checked={item.checked}
              disabled={disabled}
              onChange={() => toggle(item)}
              className={CHECKBOX_CLASSES}
            />
            <span
              className={OPTION_LABEL_CLASSES}
              dangerouslySetInnerHTML={toInnerHtml(t(item.text))}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
}
