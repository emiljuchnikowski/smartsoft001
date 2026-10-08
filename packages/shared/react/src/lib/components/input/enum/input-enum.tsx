import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { enumToList } from '../../../utils/model';
import { useInput } from '../base/use-input';
import { SmartInputFieldProps } from '../input.types';

const LABEL_CLASSES =
  'smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white';

/**
 * `<smart-input-enum>` (Angular `InputEnumComponent`): a fieldset with a
 * checkbox per key of `fieldOptions.possibilities` (an enum); the control
 * holds the list of the checked keys. `className` goes on the group of
 * checkboxes.
 */
export function SmartInputEnum<T>(props: SmartInputFieldProps<T>) {
  const { fieldOptions, className } = props;
  const t = useTranslate();
  const { control, value, required, disabled, label, setValue } =
    useInput(props);

  if (!control) return null;

  const selected: unknown[] = Array.isArray(value) ? value : [];
  const items: string[] | undefined = enumToList(fieldOptions?.possibilities);

  const checked = (item: string) => selected.some((i) => i === item);

  const change = (item: string) => {
    setValue(
      checked(item) ? selected.filter((i) => i !== item) : [...selected, item],
    );
  };

  return (
    <fieldset>
      <legend className={LABEL_CLASSES}>
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </legend>
      <div className={cn('smart:mt-2', 'smart:space-y-2', className)}>
        {items?.map((item) => (
          <label
            key={item}
            className="smart:flex smart:items-center smart:gap-x-2"
          >
            <input
              type="checkbox"
              checked={checked(item)}
              disabled={disabled}
              onChange={() => change(item)}
              className="smart:h-4 smart:w-4 smart:rounded smart:border-gray-300 smart:text-indigo-600 smart:focus:ring-indigo-500 smart:dark:border-gray-600"
            />
            <span className="smart:text-sm smart:text-gray-900 smart:dark:text-white">
              {t(item)}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
