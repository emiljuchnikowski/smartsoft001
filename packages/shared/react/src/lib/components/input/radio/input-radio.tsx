import { useInputRadio } from './use-input-radio';
import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { SmartInputFieldProps } from '../input.types';

const LABEL_CLASSES =
  'smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white';

/**
 * The `radio` field: a fieldset with one radio per possibility, bound to the
 * control by the possibility's `id`. `className` goes on the group of radios.
 */
export function SmartInputRadio<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const t = useTranslate();
  const {
    control,
    value,
    required,
    disabled,
    label,
    fieldKey,
    possibilities,
    setValue,
    markAsTouched,
  } = useInputRadio(props);

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
              type="radio"
              name={fieldKey}
              value={String(item.id)}
              checked={item.id === value}
              disabled={disabled}
              onChange={() => setValue(item.id)}
              onBlur={markAsTouched}
              className="smart:h-4 smart:w-4 smart:border-gray-300 smart:text-indigo-600 smart:focus:ring-indigo-500 smart:dark:border-gray-600"
            />
            <span className="smart:text-sm smart:text-gray-900 smart:dark:text-white">
              {t(item.text)}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
