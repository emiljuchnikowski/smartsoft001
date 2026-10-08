import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { toInnerHtml } from '../../../utils/html';
import { SmartInputFieldProps } from '../input.types';
import { useInputCheck } from './use-input-check';

const LABEL_CLASSES =
  'smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white';

/**
 * `<smart-input-check>` (Angular `InputCheckComponent`): a fieldset with a
 * checkbox per possibility; the control holds the ids of the checked ones.
 * The (translated) texts are rendered as sanitised HTML. `className` goes on
 * the group of checkboxes.
 */
export function SmartInputCheck<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const t = useTranslate();
  const { control, required, disabled, label, possibilities, toggle } =
    useInputCheck(props);

  if (!control) return null;

  return (
    <fieldset>
      <legend className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </legend>
      <div className={cn('smart:mt-2', 'smart:space-y-2', className)}>
        {possibilities?.map((item, index) => (
          <label
            key={index}
            className="smart:flex smart:items-center smart:gap-x-2"
          >
            <input
              type="checkbox"
              checked={item.checked}
              disabled={disabled}
              onChange={() => toggle(item)}
              className="smart:h-4 smart:w-4 smart:rounded smart:border-gray-300 smart:text-indigo-600 smart:focus:ring-indigo-500 smart:dark:border-gray-600"
            />
            <span
              className="smart:text-sm smart:text-gray-900 smart:dark:text-white"
              dangerouslySetInnerHTML={toInnerHtml(t(item.text))}
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
