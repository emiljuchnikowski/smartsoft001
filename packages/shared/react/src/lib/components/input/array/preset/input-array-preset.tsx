import { useTranslate } from '../../../../providers/hooks';
import { cn } from '../../../../utils/class-names';
import { SmartForm } from '../../../form/form';
import { SmartInputFieldProps } from '../../input.types';
import { useInputArray } from '../use-input-array';

/**
 * Styled array field variation (preset): every item is a card with its nested
 * `SmartForm` and a remove button, an empty array shows a dash, and items are
 * added with an outline button.
 */
export function SmartInputArrayPreset<T>(props: SmartInputFieldProps<T>) {
  const { className } = props;
  const t = useTranslate();
  const {
    control,
    label,
    required,
    items,
    add,
    remove,
    isStatic,
    getItemKey,
    getItemDragProps,
  } = useInputArray(props);

  if (!control) return null;

  return (
    <>
      <label
        className="smart:block smart:text-sm/6 smart:font-medium smart:text-gray-900 smart:dark:text-white"
        data-role="label"
      >
        {label}{' '}
        {required && <span className="smart:text-red-500 smart:ml-0.5">*</span>}
      </label>
      <div
        className={cn('smart:mt-2 smart:space-y-2', className)}
        data-role="array"
      >
        {items.map((item, index) => (
          <div
            key={getItemKey(item.control)}
            className="smart:flex smart:items-start smart:gap-x-2 smart:rounded-lg smart:border smart:border-gray-200 smart:dark:border-gray-700 smart:bg-white smart:dark:bg-gray-800 smart:p-3"
            data-role="item"
            {...getItemDragProps(index)}
          >
            <div className="smart:grow">
              <SmartForm options={item} />
            </div>
            {!isStatic && (
              <button
                type="button"
                className="smart:inline-flex smart:shrink-0 smart:items-center smart:justify-center smart:size-7 smart:rounded-lg smart:text-sm smart:font-medium smart:leading-none smart:text-red-600 smart:dark:text-red-500 smart:hover:bg-red-100 smart:dark:hover:bg-red-800/30 smart:focus:outline-hidden smart:focus:bg-red-100 smart:dark:focus:bg-red-800/30"
                onClick={() => remove(index)}
                aria-label={t('remove')}
                data-role="remove"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            )}
          </div>
        ))}
        {!items.length && (
          <span
            className="smart:block smart:text-sm smart:text-gray-400 smart:dark:text-gray-500"
            data-role="empty"
          >
            &mdash;
          </span>
        )}
        {!isStatic && (
          <button
            type="button"
            className="smart:inline-flex smart:items-center smart:gap-x-1.5 smart:py-2 smart:px-3 smart:rounded-lg smart:border smart:border-gray-200 smart:dark:border-gray-700 smart:text-sm smart:font-medium smart:text-gray-800 smart:dark:text-gray-200 smart:hover:bg-gray-100 smart:dark:hover:bg-gray-700 smart:focus:outline-hidden smart:focus:ring-1 smart:focus:ring-blue-600 smart:dark:focus:ring-blue-500 smart:disabled:opacity-50 smart:disabled:pointer-events-none"
            onClick={() => void add()}
            data-role="add"
          >
            <svg
              className="smart:shrink-0 smart:size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            {t('add')}
          </button>
        )}
      </div>
    </>
  );
}
